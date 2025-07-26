import type React from "react";
import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "SuiPass - Revolutionary Blockchain Ticketing Platform",
  description:
    "Revolutionizing event ticketing with blockchain technology. Secure, transparent NFT ticket marketplace built on Sui blockchain.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-black">{children}</body>
    </html>
  );
}
