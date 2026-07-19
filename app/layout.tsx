import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import CursorProvider from "@/components/Cursor";
import Nav from "@/components/Nav";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Vantage — We make brands move",
  description:
    "Vantage is a motion-design and creative studio. Motion design, interactive web, brand identity, and art direction for brands that want to move.",
  metadataBase: new URL("https://vantage.studio"),
  openGraph: {
    title: "Vantage — We make brands move",
    description: "A motion-design and creative studio.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="custom-cursor">
      <head>
        <link
          rel="preconnect"
          href="https://api.fontshare.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://api.fontshare.com/v2/css?f[]=clash-display@600,700,500&f[]=general-sans@400,500,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        style={{
          ["--font-clash" as string]: '"Clash Display"',
          ["--font-general" as string]: '"General Sans"',
        }}
      >
        <SmoothScroll>
          <CursorProvider>
            <Nav />
            <PageTransition>{children}</PageTransition>
          </CursorProvider>
        </SmoothScroll>
        <div
          aria-hidden
          className="grain pointer-events-none fixed inset-0 z-[90]"
        />
      </body>
    </html>
  );
}
