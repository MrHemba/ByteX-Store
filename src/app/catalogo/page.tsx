export const dynamic = 'force-dynamic';
export const revalidate = 0;

import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/supabase";
import CatalogoClient from "./CatalogoClient";

export const metadata: Metadata = {
  title: "Catálogo de Equipos",
  description: "Explora nuestro catálogo de laptops, PCs, impresoras y accesorios de segunda mano revisados con garantía en Ecuador.",
  alternates: {
    canonical: "https://bytexstore.es/catalogo",
  },
};

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const params = await searchParams;
  const initialCat = params.cat || "todos";
  const initialQ   = params.q  || "";

  let allProducts: any[] = [];
  try {
    allProducts = await getProducts(); // todos, sin filtro
  } catch {
    allProducts = [];
  }

  return (
    <>
      <CatalogoClient
        allProducts={allProducts}
        initialCat={initialCat}
        initialQ={initialQ}
      />
      <Footer />
    </>
  );
}
