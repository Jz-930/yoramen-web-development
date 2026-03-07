import type { Metadata } from "next";
import { Noto_Serif_JP, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-serif",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Yoramen | Japanese Ramen House",
  description: "Signature Japanese ramen and seasonal limited specials, with online ordering and dine-in available.",
  icons: {
    icon: "/images/logo/logo-32.webp",
    apple: "/images/logo/logo-256.webp",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSerifJP.variable} ${inter.variable} min-h-screen flex flex-col`}>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
