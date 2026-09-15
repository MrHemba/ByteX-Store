import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ByteX Store — Tecnología que transforma | H&G Solutions",
  description:
    "Laptops, PCs, impresoras y accesorios de segunda mano revisados. Equipos tecnológicos de calidad en Ecuador.",
  keywords: "laptops segunda mano ecuador, computadoras usadas, impresoras, equipos tecnologicos quito",
  openGraph: {
    title: "ByteX Store",
    description: "Tecnología que transforma",
    type: "website",
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
