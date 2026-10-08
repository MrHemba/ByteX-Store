import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { getProductBySlug } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

const BASE_URL = "https://bytexstore.es";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const product = await getProductBySlug(id).catch(() => null);
  if (!product) return {};

  const url = `${BASE_URL}/catalogo/${id}`;
  return {
    title: product.nombre,
    description: product.descripcion_publica || `${product.nombre} disponible en ByteX Store. Equipo revisado con garantía en Ecuador.`,
    alternates: { canonical: url },
    openGraph: {
      title: product.nombre,
      description: product.descripcion_publica || "",
      url,
      images: product.fotos_tienda?.[0] ? [{ url: product.fotos_tienda[0] }] : [],
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await getProductBySlug(id).catch(() => null);

  if (!product) notFound();

  return (
    <>
      <main style={{ paddingTop: 100, minHeight: "100vh" }}>
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
