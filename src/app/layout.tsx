import type { Metadata } from "next";
import "./globals.css";
import Layout from "@/components/dashboard/Layout";

export const metadata: Metadata = {
  title: "Techinika CMS",
  description: "Content Management System for Techinika",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased`}>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}
