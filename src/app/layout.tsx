import type { Metadata } from "next";
import { Noto_Serif_JP, Inter } from "next/font/google";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

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
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSerifJP.variable} ${inter.variable} min-h-screen flex flex-col`}>
        <SiteChrome modal={modal}>{children}</SiteChrome>
      </body>
    </html>
  );
}
