import type React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navigation } from "@/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TOEIC Writing Test System",
  description: "Online TOEIC Writing Test Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/images/death-note.svg" />
      </head>
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
