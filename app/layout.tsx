import type { Metadata } from "next";
import { Andika } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const andika = Andika({
  variable: "--font-andika",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FS-Digital Vault - Secure Digital Goods Platform",
  description: "Secure storage, instant access, and license management for premium digital goods.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${andika.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-slate-50 dark:bg-[#090D16] text-slate-900 dark:text-slate-100 selection:bg-sky-500 selection:text-white transition-colors duration-200">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
