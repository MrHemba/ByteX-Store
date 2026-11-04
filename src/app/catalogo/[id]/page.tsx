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
    description: product.descripcion_publica || `${product.nombre} disponible en ByteX Store. Con garantía en Ecuador.`,
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

  const abs = (u: string) => (u.startsWith("/") ? `${BASE_URL}${u}` : u);
  const condicionLd = { nuevo: "NewCondition", reacondicionado: "RefurbishedCondition", segunda: "UsedCondition" }[product.condicion] ?? "NewCondition";
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nombre,
    description: (product.descripcion_publica || product.nombre).replace(/\s+/g, " ").slice(0, 300),
    sku: product.codigo || product.id,
    category: product.categoria,
    image: (product.fotos_tienda || []).slice(0, 4).map(abs),
    url: `${BASE_URL}/catalogo/${id}`,
    ...(product.precio > 0 && {
      offers: {
        "@type": "Offer",
        priceCurrency: "USD",
        price: product.precio.toFixed(2),
        itemCondition: `https://schema.org/${condicionLd}`,
        availability: product.stock > 0 || product.es_servicio ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        url: `${BASE_URL}/catalogo/${id}`,
        seller: { "@type": "Organization", name: "ByteX Store" },
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd).replace(/</g, `${String.fromCharCode(92)}u003c`) }}
      />
      <main style={{ paddingTop: 64, minHeight: "100vh" }}>
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
