import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserSession } from "@/lib/admin-auth";

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const sessionRes = await getUserSession();
    if (!sessionRes.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const userId = sessionRes.user.id;

    const vaultItem = await prisma.vaultItem.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        product: true,
      },
    });

    if (!vaultItem) {
      return NextResponse.json(
        { error: "Vault item not found or you do not have permission." },
        { status: 404 }
      );
    }

    // Increment download count and update timestamp
    const updated = await prisma.vaultItem.update({
      where: { id },
      data: {
        downloadsCount: { increment: 1 },
        lastDownloadedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      downloadsCount: updated.downloadsCount,
      downloadUrl: vaultItem.product.fileUrl || `https://vault-storage.internal/assets/${vaultItem.product.slug}.zip`,
      fileName: `${vaultItem.product.slug}-${vaultItem.product.version}.zip`,
      message: `Asset prepared. Starting download...`,
    });
  } catch (error) {
    console.error("Error processing download:", error);
    return NextResponse.json({ error: "Failed to process download" }, { status: 500 });
  }
}
