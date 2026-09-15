import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts } from "@/lib/supabase";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { id: "todos",     label: "Todos" },
  { id: "laptop",    label: "Laptops" },
  { id: "pc",        label: "PCs" },
  { id: "impresora", label: "Impresoras" },
  { id: "monitor",   label: "Monitores" },
  { id: "accesorio", label: "Accesorios" },
];

export default async function CatalogoPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string; q?: string }>;
}) {
  const params = await searchParams;
  const cat = params.cat || "todos";
  const q = params.q || "";

  let products: any[] = [];
  try {
    products = await getProducts(cat === "todos" ? undefined : cat);
  } catch {
    products = [];
  }

  const filtered = q
    ? products.filter(p =>
        p.nombre.toLowerCase().includes(q.toLowerCase()) ||
        p.descripcion_publica?.toLowerCase().includes(q.toLowerCase())
      )
    : products;

  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72, minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ padding: "40px 24px 0", maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ marginBottom: 4, fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)",
            letterSpacing: "0.15em", textTransform: "uppercase" }}>
            // CATÁLOGO COMPLETO
          </div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            flexWrap: "wrap", gap: 16, marginBottom: 28 }}>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.02em" }}>
              {q ? `Resultados: "${q}"` : "Equipos disponibles"}
            </h1>
            <div style={{ fontSize: 12, color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
              {filtered.length} equipo{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Category tabs */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", paddingBottom: 0 }}>
            {CATEGORIES.map(c => {
              const isActive = cat === c.id;
              return (
                <a key={c.id}
                  href={c.id !== "todos" ? `/catalogo?cat=${c.id}` : "/catalogo"}
                  style={{
                    padding: "8px 18px", borderRadius: 8, fontSize: 12, fontWeight: 600,
                    textDecoration: "none", whiteSpace: "nowrap" as const, transition: "all 0.15s",
                    border: isActive ? "1px solid var(--accent)" : "1px solid var(--border-solid)",
                    background: isActive ? "var(--accent-dim)" : "var(--bg-elevated)",
                    color: isActive ? "var(--accent)" : "var(--text-3)",
                  }}
                >
                  {c.label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div style={{ maxWidth: 1280, margin: "20px auto 0", padding: "0 24px" }}>
          <div className="divider" />
        </div>

        {/* Products grid */}
        <div style={{ padding: "28px 24px 80px", maxWidth: 1280, margin: "0 auto" }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 24px", color: "var(--text-3)" }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
              <div style={{ fontSize: 18, fontWeight: 600, marginBottom: 8, color: "var(--text-2)" }}>
                {q ? "Sin resultados para tu búsqueda" : "No hay equipos en esta categoría"}
              </div>
              <div style={{ fontSize: 13, marginBottom: 32 }}>
                Escríbenos por WhatsApp y conseguimos lo que necesitas
              </div>
              <Link href="/catalogo" style={{ textDecoration: "none" }}>
                <button className="btn-outline" style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  Ver todos los equipos <ArrowRight size={13} />
                </button>
              </Link>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
              {filtered.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
