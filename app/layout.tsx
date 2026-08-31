import type { Metadata } from "next";
import { Andika } from "next/font/google";
import "./globals.css";

const andika = Andika({
  variable: "--font-andika",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FS Digital Vault",
  description: "A website for your vault searching.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${andika.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
