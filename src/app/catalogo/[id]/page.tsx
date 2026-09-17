import Footer from "@/components/Footer";
import { getProductBySlug } from "@/lib/supabase";
import { notFound } from "next/navigation";
import ProductDetailClient from "./ProductDetailClient";

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
      <main style={{ paddingTop: 72, minHeight: "100vh" }}>
        <ProductDetailClient product={product} />
      </main>
      <Footer />
    </>
  );
}
