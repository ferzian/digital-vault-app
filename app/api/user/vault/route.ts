import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserSession } from "@/lib/admin-auth";

export async function GET() {
  try {
    const sessionRes = await getUserSession();
    if (!sessionRes.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = sessionRes.user.id;

    const vaultItems = await prisma.vaultItem.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        product: true,
        transaction: {
          select: {
            id: true,
            referenceId: true,
            amount: true,
            createdAt: true,
            status: true,
          },
        },
      },
    });

    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        product: {
          select: { title: true, category: true, format: true },
        },
      },
    });

    return NextResponse.json({ vaultItems, transactions });
  } catch (error) {
    console.error("Error retrieving user vault:", error);
    return NextResponse.json({ error: "Failed to fetch vault items" }, { status: 500 });
  }
}
