"use client";
import { X, Trash2, ShoppingCart, Plus, Minus, Send } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useState, useEffect } from "react";

const BLANK = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='60' height='60'%3E%3Crect fill='%231A2035' width='60' height='60'/%3E%3C/svg%3E`;

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, total, itemCount } = useCart();
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  const count    = mounted ? itemCount() : 0;
  const totalVal = mounted ? total()     : 0;


  return (
    <>
      <div onClick={closeCart} style={{
        position: "fixed", inset: 0, zIndex: 200,
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
        opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? "auto" : "none",
        transition: "opacity 0.3s",
      }} />

      <div style={{
        position: "fixed", top: 0, right: 0, bottom: 0, zIndex: 201,
        width: 400, maxWidth: "100vw",
        background: "var(--bg-card)",
        borderLeft: "1px solid var(--border-solid)",
        boxShadow: "-8px 0 40px rgba(0,0,0,0.6)",
        transform: isOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.32s cubic-bezier(0.4,0,0.2,1)",
        display: "flex", flexDirection: "column",
      }}>
        {/* Header */}
        <div style={{
          padding: "16px 20px", background: "var(--bg-elevated)",
          borderBottom: "1px solid var(--border-solid)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShoppingCart size={17} style={{ color: "var(--accent)" }} />
            <span style={{ fontSize: 14, fontWeight: 700 }}>Mi cotización</span>
            {count > 0 && (
              <span style={{
                background: "var(--accent)", color: "var(--bg)",
                fontSize: 10, fontWeight: 700, fontFamily: "var(--font-mono)",
                padding: "1px 7px", borderRadius: 20,
              }}>{count}</span>
            )}
          </div>
          <button onClick={closeCart} style={{
            width: 30, height: 30, borderRadius: 6, cursor: "pointer",
            background: "transparent", border: "1px solid var(--border-solid)",
            color: "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px", display: "flex", flexDirection: "column", gap: 10 }}>
          {items.length === 0 ? (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", gap: 12, paddingTop: 80, textAlign: "center" }}>
              <ShoppingCart size={40} style={{ color: "var(--text-4)" }} />
              <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-2)" }}>Tu cotización está vacía</div>
              <div style={{ fontSize: 13, color: "var(--text-3)" }}>Agrega equipos desde el catálogo</div>
              <button onClick={closeCart} className="btn-ghost" style={{ marginTop: 8 }}>Ver catálogo</button>
            </div>
          ) : items.map(item => (
            <div key={item.product.id} style={{
              display: "flex", gap: 12, padding: "12px",
              background: "var(--bg-elevated)", borderRadius: 8, border: "1px solid var(--border-solid)",
            }}>
              <div style={{ width: 60, height: 60, borderRadius: 6, overflow: "hidden",
                flexShrink: 0, position: "relative", background: "var(--bg)" }}>
                <Image src={item.product.fotos_tienda?.[0] || BLANK} alt={item.product.nombre}
                  fill style={{ objectFit: "cover" }} unoptimized sizes="60px" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {item.product.nombre}
                </div>
                <span className="price-tag" style={{ fontSize: 14, display: "block", marginBottom: 8 }}>
                  ${(item.product.precio * item.quantity).toFixed(2)}
                </span>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} style={{
                      width: 24, height: 24, borderRadius: 5,
                      background: "var(--bg)", border: "1px solid var(--border-solid)",
                      color: "var(--text-3)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}><Minus size={10} /></button>
                    <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", minWidth: 20, textAlign: "center" }}>
                      {item.quantity}
                    </span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} style={{
                      width: 24, height: 24, borderRadius: 5,
                      background: "var(--bg)", border: "1px solid var(--border-solid)",
                      color: "var(--text-3)", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}><Plus size={10} /></button>
                  </div>
                  <button onClick={() => removeItem(item.product.id)} style={{
                    width: 24, height: 24, borderRadius: 5,
                    background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.3)",
                    color: "var(--error)", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}><Trash2 size={11} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-solid)", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <span style={{ fontSize: 13, color: "var(--text-3)" }}>Total referencial</span>
              <span className="price-tag" style={{ fontSize: 22 }}>${totalVal.toFixed(2)}</span>
            </div>
            <p style={{ fontSize: 11, color: "var(--text-4)", lineHeight: 1.5 }}>
              Precios referenciales. Los descuentos se coordinan contigo.
            </p>
            <Link href="/carrito" onClick={closeCart} style={{ textDecoration: "none", display: "block" }}>
              <button className="btn-primary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Send size={14} /> Solicitar cotización
              </button>
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
