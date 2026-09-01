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
    const search = searchParams.get("search") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    const users = await prisma.user.findMany({
      where,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        banReason: true,
        banExpires: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: {
            transactions: true,
            vaultItems: true,
            sessions: true,
          },
        },
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Error retrieving admin users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await getAdminSession();
    if (!auth.isAdmin || !auth.user?.email) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { userId, role, banned, banReason } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    // Protect self-demotion or banning current admin account accidentally
    if (userId === auth.user.id && (banned === true || (role && role !== "admin"))) {
      return NextResponse.json(
        { error: "You cannot ban or revoke admin privileges from your own active account." },
        { status: 400 }
      );
    }

    const targetUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const updateData: any = {};
    let auditAction = "USER_UPDATE";
    let auditDetails = "";

    if (role !== undefined) {
      updateData.role = role;
      auditAction = "USER_ROLE_CHANGE";
      auditDetails = `Changed role from '${targetUser.role}' to '${role}'.`;
    }

    if (banned !== undefined) {
      updateData.banned = Boolean(banned);
      updateData.banReason = banned ? (banReason || "Administrative suspension") : null;
      auditAction = banned ? "USER_BANNED" : "USER_UNBANNED";
      auditDetails = banned
        ? `Banned user with reason: ${updateData.banReason}`
        : `Revoked ban suspension for user.`;
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        banned: true,
        banReason: true,
        createdAt: true,
      },
    });

    await logAuditAction({
      adminEmail: auth.user.email,
      action: auditAction,
      target: `User: ${targetUser.email} (ID: ${userId})`,
      details: auditDetails,
    });

    return NextResponse.json({
      user: updatedUser,
      message: "User status updated successfully.",
    });
  } catch (error: any) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}
