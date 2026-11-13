import "@/app/globals.css";

// Studio is a client application; it does not need the public site's CMS queries.
export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en-CA"><body>{children}</body></html>;
}
