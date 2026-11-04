import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Sans } from "next/font/google";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};
import "./globals.css";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import NavigationProgress from "@/components/NavigationProgress";
import PageTransition from "@/components/PageTransition";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bytexstore.es";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${BASE_URL}/#organization`,
      "name": "ByteX Store",
      "alternateName": "ByteX Store — H&G Solutions",
      "url": BASE_URL,
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo-principal.jpg`,
        "width": 1536,
        "height": 836,
      },
      "description": "Tienda de tecnología en Ecuador: laptops, PCs, impresoras, monitores y accesorios nuevos con garantía, y también equipos reacondicionados y de segunda mano.",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "EC",
        "addressLocality": "Ecuador",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "availableLanguage": "Spanish",
      },
    },
    {
      "@type": "WebSite",
      "@id": `${BASE_URL}/#website`,
      "url": BASE_URL,
      "name": "ByteX Store",
      "description": "Laptops, PCs, impresoras, monitores y accesorios nuevos con garantía en Ecuador. También equipos reacondicionados y de segunda mano revisados.",
      "publisher": { "@id": `${BASE_URL}/#organization` },
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${BASE_URL}/catalogo?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      "inLanguage": "es-EC",
    },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ByteX Store | Laptops, PCs e Impresoras Nuevas con Garantía en Ecuador",
    template: "%s | ByteX Store",
  },
  description:
    "Compra laptops, PCs, impresoras, monitores y accesorios nuevos con garantía en Ecuador. Cotiza gratis por WhatsApp. HP, Dell, Lenovo y más — H&G Solutions.",
  keywords: "laptops ecuador, computadoras ecuador, impresoras ecuador, monitores, componentes pc, equipos tecnologicos garantia, bytex store, hp dell lenovo asus, laptops reacondicionadas",
  authors: [{ name: "H&G Solutions", url: BASE_URL }],
  category: "technology",
  openGraph: {
    title:       "ByteX Store | Laptops, PCs e Impresoras Nuevas con Garantía",
    description: "Laptops, PCs, impresoras y accesorios revisados con garantía en Ecuador. Equipos HP, Dell, Lenovo — H&G Solutions.",
    type:        "website",
    url:         BASE_URL,
    siteName:    "ByteX Store",
    locale:      "es_EC",
    images: [{ url: "/logo-principal.jpg", width: 1536, height: 836, alt: "ByteX Store — Tecnología con garantía en Ecuador" }],
  },
  twitter: {
    card:        "summary_large_image",
    title:       "ByteX Store | Laptops, PCs e Impresoras Nuevas con Garantía",
    description: "Equipos tecnológicos revisados con garantía en Ecuador.",
    images:      ["/logo-principal.jpg"],
  },
  alternates: {
    canonical: BASE_URL,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // suppressHydrationWarning: el script de abajo puede cambiar data-theme antes de hidratar
    <html lang="es" data-theme="light" className={`${spaceGrotesk.variable} ${dmSans.variable}`} suppressHydrationWarning>
      <head>
        {/* Aplica el tema guardado antes del primer pintado (evita el destello claro → oscuro) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem("theme")==="dark")document.documentElement.setAttribute("data-theme","dark")}catch(e){}`,
          }}
        />
        {/* JSON-LD — datos estructurados para Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
        {/* Conversión Google Ads: evento whatsapp_click en cualquier enlace o apertura de WhatsApp */}
        <Script
          id="wa-click-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){
  var isWa=function(u){return typeof u==='string'&&/(wa\\.me|api\\.whatsapp\\.com|web\\.whatsapp\\.com)/i.test(u);};
  var track=function(origen){
    try{gtag('event','whatsapp_click',{origen:origen,pagina:location.pathname,transport_type:'beacon'});}catch(e){}
  };
  document.addEventListener('click',function(e){
    var a=e.target&&e.target.closest?e.target.closest('a[href]'):null;
    if(a&&isWa(a.href)){track(a.getAttribute('aria-label')||(a.textContent||'').trim().slice(0,40)||'enlace');}
  },true);
  var openOrig=window.open;
  window.open=function(u){if(isWa(String(u)))track('cotizacion');return openOrig.apply(window,arguments);};
})();`,
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
