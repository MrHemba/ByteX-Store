import type { Metadata } from "next";
import Footer from "@/components/Footer";
import { getProducts } from "@/lib/supabase";
import CatalogoClient from "./CatalogoClient";
import type { Product } from "@/lib/types";

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

  let allProducts: Product[] = [];
  try {
    allProducts = await getProducts(); // todos, sin filtro
  } catch {
    allProducts = [];
  }

  return (
    <>
      {/* key: si cambia ?cat o ?q estando ya en /catalogo, los filtros se reinician con la URL */}
      <CatalogoClient
        key={`${initialCat}|${initialQ}`}
        allProducts={allProducts}
        initialCat={initialCat}
        initialQ={initialQ}
      />
      <Footer />
    </>
  );
}
