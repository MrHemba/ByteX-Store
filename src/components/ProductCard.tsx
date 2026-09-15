"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

const CONDITIONS: Record<string, { label: string; cls: string }> = {
  nuevo:          { label: "Nuevo",          cls: "badge badge-nuevo" },
  segunda:        { label: "Segunda vida",   cls: "badge badge-segunda" },
  reacondicionado:{ label: "Reacondicionado", cls: "badge badge-reacondicionado" },
};

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='280'%3E%3Crect fill='%231A2035' width='400' height='280'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Inter' font-size='13' fill='%23ffffff30'%3ESin imagen%3C/text%3E%3C/svg%3E`;

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const cond = CONDITIONS[product.condicion] ?? CONDITIONS.segunda;
  const imgSrc = product.fotos_tienda?.[0] || PLACEHOLDER;
  const available = product.stock > 0;
  const specs = Object.entries(product.especificaciones || {}).slice(0, 3);

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!available) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Link href={`/catalogo/${product.id}`} style={{ textDecoration: "none", display: "block", height: "100%" }}>
      <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", overflow: "hidden" }}>

        {/* Image */}
        <div style={{ position: "relative", aspectRatio: "16/10", overflow: "hidden", background: "var(--bg-elevated)" }}>
          <Image src={imgSrc} alt={product.nombre} fill
            sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,25vw"
            style={{ objectFit: "cover", transition: "transform 0.4s ease" }}
            onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.07)")}
            onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
            unoptimized={imgSrc.startsWith("data:")}
          />
          <div style={{ position: "absolute", top: 10, left: 10 }}>
            <span className={cond.cls}>{cond.label}</span>
          </div>
          {!available && (
            <div style={{ position: "absolute", inset: 0, background: "rgba(13,15,26,0.7)",
              display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, color: "var(--text-3)",
                background: "var(--bg-card)", padding: "4px 14px", borderRadius: 20,
                border: "1px solid var(--border-solid)" }}>Agotado</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {/* Categoria */}
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)",
            textTransform: "uppercase", letterSpacing: "0.1em" }}>
            {product.categoria || "Equipo"}
          </span>

          {/* Name */}
          <h3 style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", lineHeight: 1.4,
            display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
            {product.nombre}
          </h3>

          {/* Specs */}
          {specs.length > 0 && (
            <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
              {specs.map(([key, val]) => (
                <span key={key} style={{
                  fontSize: 9, fontFamily: "var(--font-mono)", fontWeight: 500,
                  padding: "2px 6px", borderRadius: 4,
                  background: "var(--bg-elevated)", color: "var(--text-3)",
                  border: "1px solid var(--border-solid)",
                }}>{key}: {String(val)}</span>
              ))}
            </div>
          )}

          {/* Price */}
          <div style={{ marginTop: "auto", paddingTop: 10 }}>
            {available && product.stock <= 2 && (
              <div style={{ fontSize: 10, color: "var(--warning)", marginBottom: 4, fontWeight: 500 }}>
                ¡Último disponible!
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
              {product.precio > 0 ? (
                <span className="price-tag" style={{ fontSize: 20 }}>
                  ${product.precio.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
                </span>
              ) : (
                <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-3)", fontStyle: "italic" }}>
                  Consultar precio
                </span>
              )}
            </div>

            {/* Add to cart button — full width */}
            <button onClick={handleAdd} disabled={!available} style={{
              width: "100%", padding: "9px", borderRadius: 7, cursor: available ? "pointer" : "not-allowed",
              background: added ? "rgba(0,214,143,0.15)" : "var(--accent-dim)",
              border: added ? "1px solid rgba(0,214,143,0.4)" : "1px solid var(--accent)",
              color: added ? "#00D68F" : "var(--accent)",
              fontSize: 11, fontWeight: 700, fontFamily: "var(--font-ui)",
              letterSpacing: "0.06em", textTransform: "uppercase",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              transition: "all 0.2s",
            }}>
              {added ? <><Check size={13} /> Agregado</> : <><ShoppingCart size={13} /> Añadir al carrito</>}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
