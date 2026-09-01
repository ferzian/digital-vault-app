import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";

    const where: any = {
      isActive: true,
    };

    if (category && category !== "ALL") {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: { createdAt: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        category: true,
        price: true,
        currency: true,
        imageUrl: true,
        fileSize: true,
        format: true,
        version: true,
        badge: true,
        licenseType: true,
        stock: true,
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error retrieving public products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}
