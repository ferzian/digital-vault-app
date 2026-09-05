import midtransClient from "midtrans-client";

// Create Snap API instance
export const snap = new midtransClient.Snap({
  isProduction: false, // Force sandbox for testing
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});

// Create Core API instance (if needed for advanced use cases)
export const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || "",
  clientKey: process.env.MIDTRANS_CLIENT_KEY || "",
});
