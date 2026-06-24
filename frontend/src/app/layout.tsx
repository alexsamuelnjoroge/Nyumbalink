import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NyumbaLink — Find Rentals in Nairobi",
  description:
    "Verified rental listings across Nairobi and environs. See real costs, matatu routes, and contact landlords directly — no broker surprises.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-[#F7F9FC] text-[#1A202C]">
        {children}
      </body>
    </html>
  );
}
