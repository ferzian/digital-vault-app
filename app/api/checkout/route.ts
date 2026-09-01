import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserSession, generateLicenseKey, generateReferenceId } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  try {
    const sessionRes = await getUserSession();
    if (!sessionRes.user) {
      return NextResponse.json(
        { error: "Authentication required. Please sign in to purchase or claim assets." },
        { status: 401 }
      );
    }

    const userId = sessionRes.user.id;
    const body = await req.json();
    const { productId, paymentMethod = "VAULT_DIRECT" } = body;

    if (!productId) {
      return NextResponse.json({ error: "Product ID is required." }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product || !product.isActive) {
      return NextResponse.json(
        { error: "This digital asset is currently unavailable or inactive." },
        { status: 404 }
      );
    }

    // Check if user already owns this item in their vault
    const existingVaultItem = await prisma.vaultItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId,
        },
      },
    });

    if (existingVaultItem) {
      return NextResponse.json(
        {
          error: "You already own this item in your Vault.",
          alreadyOwned: true,
          vaultItemId: existingVaultItem.id,
        },
        { status: 400 }
      );
    }

    // Generate transaction metadata and unique license key
    const referenceId = generateReferenceId();
    const licenseKey = generateLicenseKey("VAULT");

    // Execute atomic transaction to record order and grant vault license
    const result = await prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          referenceId,
          userId,
          productId,
          amount: product.price,
          currency: product.currency,
          status: "SUCCESS",
          paymentMethod,
          licenseKey,
          notes: `Instant settlement via ${paymentMethod}`,
        },
      });

      const vaultItem = await tx.vaultItem.create({
        data: {
          userId,
          productId,
          transactionId: transaction.id,
          licenseKey,
          downloadsCount: 0,
        },
        include: {
          product: true,
        },
      });

      return { transaction, vaultItem };
    });

    return NextResponse.json({
      success: true,
      message: `Asset '${product.title}' successfully unlocked into your Vault!`,
      transaction: result.transaction,
      vaultItem: result.vaultItem,
    });
  } catch (error: any) {
    console.error("Error processing checkout:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process transaction." },
      { status: 500 }
    );
  }
}
