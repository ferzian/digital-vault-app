import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export interface AdminAuthResult {
  isAdmin: boolean;
  user: {
    id: string;
    email: string;
    name?: string | null;
    role?: string | null;
  } | null;
  error?: string;
}

/**
 * Validates that the request has an active session and belongs to an admin.
 */
export async function getAdminSession(): Promise<AdminAuthResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { isAdmin: false, user: null, error: "Unauthorized: Please log in." };
    }

    if (session.user.role !== "admin") {
      return {
        isAdmin: false,
        user: session.user,
        error: "Forbidden: Admin privileges required.",
      };
    }

    return {
      isAdmin: true,
      user: session.user,
    };
  } catch (error) {
    console.error("Error retrieving admin session:", error);
    return { isAdmin: false, user: null, error: "Internal session authentication error." };
  }
}

/**
 * Validates that the request has an active user session.
 */
export async function getUserSession() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { user: null, error: "Unauthorized: Please log in." };
    }

    return {
      user: session.user,
      error: null,
    };
  } catch (error) {
    console.error("Error retrieving user session:", error);
    return { user: null, error: "Internal session authentication error." };
  }
}

/**
 * Logs an administrative or security action to the audit_log table.
 */
export async function recordAuditLog({
  adminEmail,
  action,
  target,
  details,
  ipAddress,
}: {
  adminEmail: string;
  action: string;
  target?: string;
  details?: string;
  ipAddress?: string;
}) {
  try {
    return await prisma.auditLog.create({
      data: {
        adminEmail,
        action,
        target,
        details,
        ipAddress,
      },
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
    return null;
  }
}
export async function logAuditAction({ adminEmail, action, target, details, ipAddress }: { adminEmail: string; action: string; target?: string; details?: string; ipAddress?: string; }) {
  return await recordAuditLog({ adminEmail, action, target, details, ipAddress });
}

/**
 * Generates a unique cryptographic License Key in format: VAULT-XXXX-XXXX-XXXX
 */
export function generateLicenseKey(prefix = "VAULT"): string {
  const part1 = crypto.randomBytes(2).toString("hex").toUpperCase();
  const part2 = crypto.randomBytes(2).toString("hex").toUpperCase();
  const part3 = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${prefix}-${part1}-${part2}-${part3}`;
}

/**
 * Generates a unique transaction reference ID: TXN-YYYYMM-XXXX
 */
export function generateReferenceId(): string {
  const dateStr = new Date().toISOString().slice(0, 7).replace("-", "");
  const randomSuffix = crypto.randomBytes(3).toString("hex").toUpperCase();
  return `TXN-${dateStr}-${randomSuffix}`;
}

/**
 * Generates a clean URL slug from title
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
