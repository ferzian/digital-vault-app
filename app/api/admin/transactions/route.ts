import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession, logAuditAction } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "";
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (status && status !== "ALL") {
      where.status = status;
    }
    if (search) {
      where.OR = [
        { referenceId: { contains: search, mode: "insensitive" } },
        { licenseKey: { contains: search, mode: "insensitive" } },
        { user: { email: { contains: search, mode: "insensitive" } } },
        { user: { name: { contains: search, mode: "insensitive" } } },
        { product: { title: { contains: search, mode: "insensitive" } } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        product: {
          select: { id: true, title: true, category: true, format: true, price: true },
        },
        vaultItem: {
          select: { id: true, downloadsCount: true },
        },
      },
    });

    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("Error retrieving admin transactions:", error);
    return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAdminSession();
    if (!auth.isAdmin || !auth.user?.email) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { transactionId, status, notes } = body;

    if (!transactionId || !status) {
      return NextResponse.json(
        { error: "Transaction ID and new status are required." },
        { status: 400 }
      );
    }

    const existing = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { product: true, user: true },
    });

    if (!existing) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    const updated = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
        notes: notes !== undefined ? notes : existing.notes,
      },
    });

    // If status changed to REFUNDED or FAILED, we can revoke access from user's vault if desired
    if (status === "REFUNDED" || status === "FAILED") {
      await prisma.vaultItem.deleteMany({
        where: { transactionId },
      });
    }

    await logAuditAction({
      adminEmail: auth.user.email,
      action: "TRANSACTION_STATUS_UPDATE",
      target: `Transaction: ${existing.referenceId}`,
      details: `Updated status from '${existing.status}' to '${status}' for user ${existing.user.email}.`,
    });

    return NextResponse.json({
      transaction: updated,
      message: `Transaction status updated to ${status}.`,
    });
  } catch (error: any) {
    console.error("Error updating transaction status:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update transaction" },
      { status: 500 }
    );
  }
}
