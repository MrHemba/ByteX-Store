import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
import "./globals.css";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import NavigationProgress from "@/components/NavigationProgress";
import PageTransition from "@/components/PageTransition";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bytexstore.es";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: "ByteX Store — Tecnología que transforma | H&G Solutions",
  description:
    "Laptops, PCs, impresoras y accesorios de segunda mano revisados. Equipos tecnológicos de calidad en Ecuador.",
  keywords: "laptops segunda mano ecuador, computadoras usadas, impresoras, equipos tecnologicos quito",
  icons: {
    icon:     "/logo.png",
    shortcut: "/logo.png",
    apple:    "/logo.png",
  },
  openGraph: {
    title:       "ByteX Store — Tecnología que transforma",
    description: "Laptops, PCs e impresoras de segunda mano revisados por expertos. H&G Solutions Ecuador.",
    type:        "website",
    images: [{ url: "/logo-principal.jpg", width: 1536, height: 836, alt: "ByteX Store" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "ByteX Store",
    description: "Tecnología que transforma",
    images:      ["/logo-principal.jpg"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        {/* Google Tag Manager — script en <head> */}
        <Script
          id="gtm-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-N6GJS9VQ');`,
          }}
        />
        {/* Google Analytics GA4 */}
        <Script
          id="ga-script"
          strategy="afterInteractive"
          src="https://www.googletagmanager.com/gtag/js?id=G-QRRGT5D3VT"
        />
        <Script
          id="ga-config"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-QRRGT5D3VT');`,
          }}
        />
      </head>
      <body>
        {/* Google Tag Manager — noscript fallback en <body> */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N6GJS9VQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        {/* Progress bar at the very top — always on top, never animated */}
        <NavigationProgress />
        {/* Navbar is outside the transition wrapper so it never flickers */}
        <Navbar />
        {/* Page content fades in on every route change */}
        <PageTransition>
          {children}
        </PageTransition>
      </body>
    </html>
  );
}
