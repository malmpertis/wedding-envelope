import type { Metadata, Viewport } from "next";
import { asset } from "@/lib/paths";
import "./globals.css";

export const metadata: Metadata = {
  title: "Βασίλης & Ιωάννα — Πρόσκληση Γάμου",
  description:
    "Με χαρά σας προσκαλούμε στον γάμο του Βασίλη και της Ιωάννας · 11 Σεπτεμβρίου 2027",
  icons: {
    icon: [{ url: asset("/icons/favicon-32.png"), type: "image/png", sizes: "32x32" }],
    apple: [{ url: asset("/icons/apple-touch-icon.png"), sizes: "180x180" }],
  },
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
    <html lang="el" className="h-full antialiased" suppressHydrationWarning>
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
          href={asset("/couple.webp")}
          type="image/webp"
        />
        <link rel="preload" as="image" href={asset("/couple.jpg")} />
        <link rel="preload" as="image" href={asset("/welcome-script.png")} />
        <link rel="preload" as="image" href={asset("/maps/ceremony.jpg")} />
      </head>
      {/* Extensions (e.g. ColorZilla) inject attributes like cz-shortcut-listen */}
      <body className="min-h-full font-display" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
