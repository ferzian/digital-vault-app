import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession, logAuditAction, generateSlug } from "@/lib/admin-auth";

export async function GET(req: NextRequest) {
  try {
    const auth = await getAdminSession();
    if (!auth.isAdmin) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { category: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category && category !== "ALL") {
      where.category = category;
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { transactions: true, vaultItems: true },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error retrieving admin products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAdminSession();
    if (!auth.isAdmin || !auth.user?.email) {
      return NextResponse.json({ error: auth.error || "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const {
      title,
      description,
      category,
      price,
      currency = "USD",
      format,
      version = "v1.0.0",
      fileSize,
      fileUrl,
      badge,
      licenseType = "Commercial License",
      stock = -1,
      isActive = true,
    } = body;

    if (!title || !description || !category || price === undefined || price === null) {
      return NextResponse.json(
        { error: "Title, description, category, and price are required." },
        { status: 400 }
      );
    }

    let slug = generateSlug(title);
    // Ensure slug uniqueness
    const existingSlug = await prisma.product.findUnique({ where: { slug } });
    if (existingSlug) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await prisma.product.create({
      data: {
        title,
        slug,
        description,
        category,
        price: parseFloat(price.toString()),
        currency,
        format: format || "ZIP Archive",
        version: version || "v1.0.0",
        fileSize: fileSize || "10.0 MB",
        fileUrl: fileUrl || `https://vault-storage.internal/assets/${slug}.zip`,
        badge: badge || null,
        licenseType: licenseType || "Commercial License",
        stock: parseInt(stock.toString(), 10) || -1,
        isActive: Boolean(isActive),
      },
    });

    // Record audit log
    await logAuditAction({
      adminEmail: auth.user.email,
      action: "PRODUCT_CREATE",
      target: `Product: ${product.title} (ID: ${product.id})`,
      details: `Created new digital product with price $${product.price}, category '${product.category}'.`,
    });

    return NextResponse.json({ product, message: "Product successfully created." }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: error.message || "Failed to create product" }, { status: 500 });
  }
}
