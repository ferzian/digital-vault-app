import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserSession, generateLicenseKey, generateReferenceId } from "@/lib/admin-auth";
import { snap } from "@/lib/midtrans";
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

    if (paymentMethod === "MIDTRANS") {
      // Assuming product.price is in USD, converting to IDR for Midtrans compatibility (approx rate)
      const exchangeRate = 15000;
      const grossAmount = Math.round(product.price * exchangeRate);

      const transaction = await prisma.transaction.create({
        data: {
          referenceId,
          userId,
          productId,
          amount: product.price,
          currency: product.currency,
          status: "PENDING",
          paymentMethod,
          notes: "Pending Midtrans payment",
        },
      });

      const parameter = {
        transaction_details: {
          order_id: referenceId,
          gross_amount: grossAmount,
        },
        customer_details: {
          first_name: sessionRes.user.name || "Customer",
          email: sessionRes.user.email,
        },
        item_details: [
          {
            id: product.id,
            price: grossAmount,
            quantity: 1,
            name: product.title.substring(0, 50),
          },
        ],
      };

      const snapResponse = await snap.createTransaction(parameter);

      await prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          snapToken: snapResponse.token,
          snapRedirectUrl: snapResponse.redirect_url,
        },
      });

      return NextResponse.json({
        success: true,
        snapToken: snapResponse.token,
        redirectUrl: snapResponse.redirect_url,
        transaction,
      });
    }

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
