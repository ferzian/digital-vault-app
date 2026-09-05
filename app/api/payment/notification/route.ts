import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateLicenseKey } from "@/lib/admin-auth";
import { coreApi } from "@/lib/midtrans";

export async function POST(req: NextRequest) {
  try {
    const notificationJson = await req.json();

    // Verify the notification using Midtrans SDK
    const statusResponse = await coreApi.transaction.notification(notificationJson);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;
    const fraudStatus = statusResponse.fraud_status;
    const rawResponse = JSON.stringify(notificationJson);

    console.log(`Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`);

    const transaction = await prisma.transaction.findUnique({
      where: { referenceId: orderId },
      include: { product: true },
    });

    if (!transaction) {
      console.error(`Transaction not found for Order ID: ${orderId}`);
      return NextResponse.json({ message: "Transaction not found" }, { status: 404 });
    }

    let finalStatus = transaction.status;

    if (transactionStatus === 'capture') {
      if (fraudStatus === 'challenge') {
        finalStatus = 'PENDING'; // Or some other status for challenge
      } else if (fraudStatus === 'accept') {
        finalStatus = 'SUCCESS';
      }
    } else if (transactionStatus === 'settlement') {
      finalStatus = 'SUCCESS';
    } else if (transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire') {
      finalStatus = 'FAILED';
    } else if (transactionStatus === 'pending') {
      finalStatus = 'PENDING';
    }

    // Update transaction status
    await prisma.transaction.update({
      where: { id: transaction.id },
      data: {
        status: finalStatus,
        midtransStatus: transactionStatus,
        rawMidtransResponse: rawResponse,
      }
    });

    // If payment is successful and vault item doesn't exist yet, create it
    if (finalStatus === 'SUCCESS') {
      const existingVaultItem = await prisma.vaultItem.findUnique({
        where: { transactionId: transaction.id }
      });

      if (!existingVaultItem) {
        const licenseKey = generateLicenseKey("VAULT");
        
        await prisma.vaultItem.create({
          data: {
            userId: transaction.userId,
            productId: transaction.productId,
            transactionId: transaction.id,
            licenseKey,
            downloadsCount: 0,
          }
        });
        
        // Update transaction with license key
        await prisma.transaction.update({
          where: { id: transaction.id },
          data: { licenseKey }
        });
        
        console.log(`Vault item created for user ${transaction.userId} and product ${transaction.productId}`);
      }
    }

    return NextResponse.json({ status: "OK" });
  } catch (error) {
    console.error("Error processing Midtrans webhook:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
