import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession, logAuditAction } from "@/lib/admin-auth";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: {
          select: { transactions: true, vaultItems: true },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error retrieving product:", error);
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAdminSession();
    if (!auth.isAdmin || !auth.user?.email) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const {
      title,
      description,
      category,
      price,
      currency,
      format,
      version,
      fileSize,
      fileUrl,
      badge,
      licenseType,
      stock,
      isActive,
    } = body;

    const updated = await prisma.product.update({
      where: { id },
      data: {
        title: title !== undefined ? title : existing.title,
        description: description !== undefined ? description : existing.description,
        category: category !== undefined ? category : existing.category,
        price: price !== undefined ? parseFloat(price.toString()) : existing.price,
        currency: currency !== undefined ? currency : existing.currency,
        format: format !== undefined ? format : existing.format,
        version: version !== undefined ? version : existing.version,
        fileSize: fileSize !== undefined ? fileSize : existing.fileSize,
        fileUrl: fileUrl !== undefined ? fileUrl : existing.fileUrl,
        badge: badge !== undefined ? badge : existing.badge,
        licenseType: licenseType !== undefined ? licenseType : existing.licenseType,
        stock: stock !== undefined ? parseInt(stock.toString(), 10) : existing.stock,
        isActive: isActive !== undefined ? Boolean(isActive) : existing.isActive,
      },
    });

    await logAuditAction({
      adminEmail: auth.user.email,
      action: "PRODUCT_UPDATE",
      target: `Product: ${updated.title} (ID: ${id})`,
      details: `Updated product properties. Active: ${updated.isActive}, Price: $${updated.price}.`,
    });

    return NextResponse.json({ product: updated, message: "Product updated successfully." });
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: error.message || "Failed to update product" }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const auth = await getAdminSession();
    if (!auth.isAdmin || !auth.user?.email) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const existing = await prisma.product.findUnique({
      where: { id },
      include: {
        _count: { select: { transactions: true, vaultItems: true } },
      },
    });

    if (!existing) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // If product has transactions, soft-deactivate instead of hard delete to preserve referential integrity
    if (existing._count.transactions > 0 || existing._count.vaultItems > 0) {
      const deactivated = await prisma.product.update({
        where: { id },
        data: { isActive: false },
      });

      await logAuditAction({
        adminEmail: auth.user.email,
        action: "PRODUCT_DEACTIVATE",
        target: `Product: ${existing.title} (ID: ${id})`,
        details: `Product has existing purchases/vault items. Deactivated instead of hard delete.`,
      });

      return NextResponse.json({
        message: "Product deactivated (has linked transactions/vault records).",
        deactivated: true,
        product: deactivated,
      });
    }

    // Hard delete if completely clean
    await prisma.product.delete({ where: { id } });

    await logAuditAction({
      adminEmail: auth.user.email,
      action: "PRODUCT_DELETE",
      target: `Product: ${existing.title} (ID: ${id})`,
      details: `Permanently removed product from database.`,
    });

    return NextResponse.json({ message: "Product deleted successfully." });
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: error.message || "Failed to delete product" }, { status: 500 });
  }
}
