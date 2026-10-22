"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check } from "lucide-react";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/cart-store";

const CONDITIONS: Record<string, { label: string; color: string; bg: string; border: string }> = {
  nuevo:           { label: "Nuevo",           color: "#16A34A", bg: "rgba(22,163,74,0.10)",  border: "rgba(22,163,74,0.25)" },
  reacondicionado: { label: "Reacondicionado", color: "#D97706", bg: "rgba(217,119,6,0.10)",  border: "rgba(217,119,6,0.25)" },
  segunda:         { label: "Segunda vida",    color: "#71717A", bg: "rgba(113,113,122,0.10)", border: "rgba(113,113,122,0.25)" },
};

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400'%3E%3Crect fill='%23F4F4F5' width='400' height='400'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='14' fill='%23A1A1AA'%3ESin imagen%3C/text%3E%3C/svg%3E`;

export default function ProductCard({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const cond = CONDITIONS[product.condicion] ?? CONDITIONS.segunda;
  const imgSrc = product.fotos_tienda?.[0] || PLACEHOLDER;
  const available = product.es_servicio || product.stock > 0;
  const lowStock   = !product.es_servicio && available && product.stock <= 2 && product.stock !== 99;
  const dropiStock = product.stock === 99; // centinela Dropi — no hay cantidad real

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault();
    if (!available) return;
    addItem(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <Link href={`/catalogo/${product.id}`} className="pc-link">
      <div className="pc-card">

        {/* ── IMAGE ── */}
        <div className="pc-img-wrap">
          <Image
            src={imgSrc}
            alt={product.nombre}
            fill
            sizes="(max-width:640px) 50vw,(max-width:1024px) 33vw,25vw"
            style={{ objectFit: "contain" }}
            unoptimized={imgSrc.startsWith("data:")}
          />

          {/* Agotado overlay */}
          {!available && (
            <div className="pc-sold-overlay">
              <span className="pc-sold-badge">Agotado</span>
            </div>
          )}

        </div>

        {/* ── BODY ── */}
        <div className="pc-body">

          {/* Row 1: category + stock */}
          <div className="pc-meta">
            <span className="pc-cat">{product.categoria || "Equipo"}</span>
            {!product.es_servicio && (
              <span className={`pc-stock${!available ? " out" : lowStock ? " low" : ""}`}>
                {!available ? "Agotado" : lowStock ? (product.stock === 1 ? "Último" : `Últimos ${product.stock}`) : dropiStock ? "Disponible" : `${product.stock} disponibles`}
              </span>
            )}
          </div>

          {/* Row 2: name */}
          <h3 className="pc-name">{product.nombre}</h3>

          {/* Row 3: condition */}
          <span className="pc-cond" style={{ color: cond.color, background: cond.bg, border: `1px solid ${cond.border}` }}>
            {cond.label}
          </span>

          {/* Row 4: price */}
          <div className="pc-price-row">
            {product.precio > 0 ? (
              <span className="pc-price">
                ${product.precio.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
              </span>
            ) : (
              <span className="pc-consult">Precio a consultar</span>
            )}
          </div>

          {/* Row 5: CTA */}
          <button
            onClick={handleAdd}
            disabled={!available}
            className={`pc-btn${added ? " added" : ""}${!available ? " disabled" : ""}`}
            aria-label={available ? `Agregar ${product.nombre} a la cotización` : `${product.nombre} agotado`}
          >
            <span className="pc-btn-inner" key={added ? "added" : "idle"}>
              {added
                ? <><Check size={14} /> Agregado</>
                : !available
                  ? <>Agotado</>
                  : <><ShoppingCart size={14} /> Cotizar</>
              }
            </span>
          </button>

        </div>
      </div>

      <style>{`
        .pc-link {
          text-decoration: none;
          display: block;
          height: 100%;
        }
        .pc-card {
          height: 100%;
          display: flex;
          flex-direction: column;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 8px;
          overflow: hidden;
          transition: border-color 200ms var(--ease-out), box-shadow 200ms var(--ease-out);
        }
        @media (hover: hover) and (pointer: fine) {
          .pc-card:hover {
            border-color: var(--accent);
            box-shadow: 0 0 0 3px var(--accent-dim);
          }
        }
        .pc-link:focus-visible { outline: none; }
        .pc-link:focus-visible .pc-card { border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-dim); }

        /* Image */
        .pc-img-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: #ffffff;
          flex-shrink: 0;
          overflow: hidden;
          border-bottom: 1px solid var(--border);
        }
        /* Las fotos de producto no se recortan: margen interior y escala sutil al pasar */
        .pc-img-wrap img {
          padding: 10px;
          transition: transform 320ms var(--ease-out);
        }
        @media (hover: hover) and (pointer: fine) {
          .pc-card:hover .pc-img-wrap img { transform: scale(1.04); }
        }
        .pc-sold-overlay {
          position: absolute;
          inset: 0;
          background: rgba(255,255,255,0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
        }
        .pc-sold-badge {
          font-size: 11px;
          font-weight: 600;
          font-family: var(--font-ui);
          color: #fff;
          background: #18181B;
          padding: 5px 14px;
          border-radius: 20px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        /* Body */
        .pc-body {
          flex: 1;
          padding: 10px 12px 12px;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        /* Meta row */
        .pc-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 6px;
        }
        .pc-cat {
          font-size: 11px;
          font-weight: 600;
          font-family: var(--font-ui);
          color: var(--text-3);
          text-transform: uppercase;
          letter-spacing: 0.07em;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pc-stock {
          font-size: 11px;
          font-weight: 600;
          font-family: var(--font-ui);
          color: var(--text-2);
          white-space: nowrap;
          flex-shrink: 0;
          font-variant-numeric: tabular-nums;
        }
        .pc-stock.low { color: var(--warning); }
        .pc-stock.out { color: var(--error); }

        /* Name */
        .pc-name {
          font-size: 13px;
          font-weight: 600;
          font-family: var(--font-display);
          color: var(--text);
          line-height: 1.35;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          margin: 0;
          min-height: calc(2 * 1.35em); /* reserva 2 líneas: alinea precio y botón entre tarjetas */
        }

        /* Condition */
        .pc-cond {
          display: inline-block;
          width: fit-content;
          font-size: 10px;
          font-weight: 600;
          font-family: var(--font-ui);
          padding: 3px 8px;
          border-radius: 4px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        /* Price */
        .pc-price-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 6px;
          padding-top: 6px;
          margin-top: auto;
        }
        .pc-price {
          font-size: 18px;
          font-weight: 700;
          font-family: var(--font-display);
          color: var(--text);
          letter-spacing: -0.03em;
          line-height: 1;
        }
        .pc-consult {
          font-size: 13px;
          font-family: var(--font-ui);
          color: var(--text-2);
        }

        /* CTA Button */
        .pc-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 6px;
          cursor: pointer;
          background: var(--accent);
          border: none;
          color: #ffffff;
          font-size: 13px;
          font-weight: 600;
          font-family: var(--font-ui);
          white-space: nowrap;
          min-height: 36px;
        }
        @media (hover: hover) and (pointer: fine) {
          .pc-btn:hover:not(.disabled) { background: var(--accent-hover); }
        }
        .pc-btn.added { background: var(--success) !important; }
        /* El cambio de texto entra con un leve desenfoque en vez de saltar */
        .pc-btn-inner {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }
        .pc-btn.added .pc-btn-inner { animation: pcBtnSwap 220ms var(--ease-out); }
        @keyframes pcBtnSwap {
          from { opacity: 0; filter: blur(3px); transform: translateY(2px); }
          to   { opacity: 1; filter: blur(0);   transform: translateY(0); }
        }
        .pc-btn.disabled {
          cursor: not-allowed;
          background: var(--bg-alt);
          color: var(--text-3);
        }

        /* Móvil: tarjetas compactas para 2 columnas */
        @media (max-width: 480px) {
          .pc-body { padding: 8px 9px 10px; gap: 4px; }
          .pc-cat, .pc-stock { font-size: 10px; }
          .pc-name { font-size: 12.5px; }
          .pc-cond { font-size: 9px; padding: 2px 6px; }
          .pc-price { font-size: 16px; }
          .pc-btn { font-size: 12.5px; padding: 7px 6px; }
          .pc-img-wrap img { padding: 6px; }
        }
      `}</style>
    </Link>
  );
}
