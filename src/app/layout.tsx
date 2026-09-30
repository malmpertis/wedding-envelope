import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Βασίλης & Ιωάννα — Πρόσκληση Γάμου",
  description:
    "Με χαρά σας προσκαλούμε στον γάμο του Βασίλη και της Ιωάννας · 11 Σεπτεμβρίου 2027",
  openGraph: {
    title: "Βασίλης & Ιωάννα — Πρόσκληση Γάμου",
    description:
      "11 Σεπτεμβρίου 2027 · Άγιος Νικόλαος Πειραιά · Terra Verde Ταύρος",
    locale: "el_GR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f3efe9",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="el" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Source+Sans+3:wght@400;500;600&display=swap&subset=greek,latin,latin-ext"
          rel="stylesheet"
        />
        <link
          rel="preload"
          as="image"
          href="/couple.webp"
          type="image/webp"
        />
        <link rel="preload" as="image" href="/couple.jpg" />
        <link rel="preload" as="image" href="/welcome-script.png" />
      </head>
      <body className="min-h-full font-display">{children}</body>
    </html>
  );
}
