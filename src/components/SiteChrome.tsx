"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { SiteSettingsContent } from "@/sanity/types";

export default function SiteChrome({
  children,
  modal,
  settings,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
  settings?: SiteSettingsContent | null;
}) {
  const pathname = usePathname();
  const isStudio = pathname?.startsWith("/studio");

  if (isStudio) {
    return <>{children}</>;
  }

  return (
    <>
      <Navbar settings={settings} />
      <main className="flex-grow">{children}</main>
      <Footer settings={settings} />
      {modal}
    </>
  );
}
