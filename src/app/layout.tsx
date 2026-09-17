import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
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
      <body>{children}</body>
    </html>
  );
}
