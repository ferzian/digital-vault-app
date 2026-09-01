import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession } from "@/lib/admin-auth";

export async function GET() {
  try {
    const auth = await getAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: 403 });
    }

    const [totalUsers, totalProducts, totalTransactions, transactions, activeSessions] =
      await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.transaction.count(),
        prisma.transaction.findMany({
          where: { status: "SUCCESS" },
          select: { amount: true },
        }),
        prisma.session.count({
          where: { expiresAt: { gt: new Date() } },
        }),
      ]);

    const totalRevenue = transactions.reduce((acc, t) => acc + (t.amount || 0), 0);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalProducts,
        totalTransactions,
        totalRevenue,
        activeSessions,
      },
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
