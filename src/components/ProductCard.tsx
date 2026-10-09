"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Check, Heart } from "lucide-react";
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
            style={{ objectFit: "cover" }}
            unoptimized={imgSrc.startsWith("data:")}
          />

          {/* Agotado overlay */}
          {!available && (
            <div className="pc-sold-overlay">
              <span className="pc-sold-badge">Agotado</span>
            </div>
          )}

          {/* Wishlist / placeholder action */}
          <button className="pc-heart" onClick={e => e.preventDefault()} aria-label="Guardar">
            <Heart size={14} />
          </button>
        </div>

        {/* ── BODY ── */}
        <div className="pc-body">

          {/* Row 1: category + stock */}
          <div className="pc-meta">
            <span className="pc-cat">{product.categoria || "Equipo"}</span>
            {!product.es_servicio && (
              <span className={`pc-stock${!available ? " out" : lowStock ? " low" : ""}`}>
                {!available ? "Agotado" : lowStock ? "Último" : dropiStock ? "Disponible" : `Stock ${product.stock}`}
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
            <span className="pc-price-label">Precio</span>
            {product.precio > 0 ? (
              <span className="pc-price">
                ${product.precio.toLocaleString("es-EC", { minimumFractionDigits: 2 })}
              </span>
            ) : (
              <span className="pc-consult">Consultar</span>
            )}
          </div>

          {/* Row 5: CTA */}
          <button
            onClick={handleAdd}
            disabled={!available}
            className={`pc-btn${added ? " added" : ""}${!available ? " disabled" : ""}`}
          >
            {added
              ? <><Check size={13} /> Agregado</>
              : <><ShoppingCart size={13} /> Añadir al carrito</>
            }
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
          transition: border-color 0.18s, box-shadow 0.18s;
        }
        .pc-card:hover {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px var(--accent-dim);
        }

        /* Image */
        .pc-img-wrap {
          position: relative;
          aspect-ratio: 1 / 1;
          background: var(--bg-alt);
          flex-shrink: 0;
          overflow: hidden;
        }
        .pc-sold-overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,0.45);
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
          background: rgba(0,0,0,0.6);
          padding: 4px 14px;
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,0.3);
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .pc-heart {
          position: absolute;
          bottom: 10px;
          right: 10px;
          z-index: 4;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255,255,255,0.92);
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #A1A1AA;
          transition: color 0.15s, background 0.15s;
        }
        .pc-heart:hover { color: #E11D48; background: #fff; }

        /* Body */
        .pc-body {
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
          color: var(--accent);
          white-space: nowrap;
          flex-shrink: 0;
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
          border-top: 1px solid var(--border);
          padding-top: 7px;
          margin-top: 4px;
        }
        .pc-price-label {
          font-size: 11px;
          font-family: var(--font-ui);
          color: var(--text-3);
          font-weight: 500;
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
          color: var(--text-3);
          font-style: italic;
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
          transition: background 0.15s;
          white-space: nowrap;
        }
        .pc-btn:hover:not(.disabled) { background: var(--accent-hover); }
        .pc-btn.added {
          background: #16A34A !important;
        }
        .pc-btn.disabled {
          cursor: not-allowed;
          background: var(--bg-alt);
          color: var(--text-3);
        }
      `}</style>
    </Link>
  );
}
