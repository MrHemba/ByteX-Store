"use client";
import { useState, useEffect, useRef } from "react";
import Footer from "@/components/Footer";
import { useCart, maxQuantity } from "@/lib/cart-store";
import { createCotizacion, getProductsByIds } from "@/lib/supabase";
import { Trash2, Plus, Minus, MessageCircle, Send, CheckCircle, AlertTriangle, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const PLACEHOLDER = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect fill='%231A2035' width='80' height='80'/%3E%3C/svg%3E`;

const waLink = (msg?: string) =>
  `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}${msg ? `?text=${encodeURIComponent(msg)}` : ""}`;

export default function CarritoPage() {
  const { items: storedItems, removeItem, updateQuantity, refreshProducts, total, clearCart } = useCart();
  const [mounted, setMounted] = useState(false);
  const [step, setStep]   = useState<"cart" | "form" | "success">("cart");
  const [loading, setLoading] = useState(false);
  const [saveError, setSaveError] = useState(false);
  const [changes, setChanges] = useState<string[]>([]);
  const [sentMsg, setSentMsg] = useState("");
  const [form, setForm]   = useState({ nombre: "", whatsapp: "", email: "", notas: "" });
  const refreshed = useRef(false);

  // El carrito vive en localStorage: no existe en el render del servidor
  useEffect(() => { setMounted(true); }, []);
  const items     = mounted ? storedItems : [];
  const cartTotal = mounted ? total() : 0;

  // Precios y stock actuales: el carrito guardado puede tener datos de hace días
  useEffect(() => {
    if (!mounted || refreshed.current) return;
    refreshed.current = true;
    const current = useCart.getState().items;
    if (current.length === 0) return;
    getProductsByIds(current.map(i => i.product.id)).then(fresh => {
      const notes: string[] = [];
      for (const { product, quantity } of current) {
        if (!(product.id in fresh)) continue;
        const now = fresh[product.id];
        if (!now || maxQuantity(now) === 0) notes.push(`"${product.nombre}" ya no está disponible y se quitó.`);
        else if (now.precio !== product.precio) notes.push(`"${now.nombre}" cambió de precio: $${product.precio.toFixed(2)} → $${now.precio.toFixed(2)}.`);
        else if (quantity > maxQuantity(now)) notes.push(`"${now.nombre}": solo hay ${maxQuantity(now)} disponible(s).`);
      }
      refreshProducts(fresh);
      setChanges(notes);
    });
  }, [mounted, refreshProducts]);

  const generateWhatsAppMsg = () => {
    const lines = items
      .map(i => `• ${i.product.nombre} ×${i.quantity} — $${(i.product.precio * i.quantity).toFixed(2)}`)
      .join("\n");
    return `Hola ByteX Store! 👋\n\nSolicito cotización por:\n${lines}\n\n💰 Total referencial: $${cartTotal.toFixed(2)}\n\nNombre: ${form.nombre || "—"}\n${form.notas ? `Notas: ${form.notas}` : ""}`;
  };

  const finish = () => {
    const msg = generateWhatsAppMsg();
    setSentMsg(msg);
    window.open(waLink(msg), "_blank");
    setStep("success");
    clearCart();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSaveError(false);
    let ok = false;
    try {
      ok = await createCotizacion({
        cliente_nombre:    form.nombre.trim(),
        cliente_whatsapp:  form.whatsapp.trim(),
        cliente_email:     form.email.trim(),
        notas_cliente:     form.notas.trim(),
        subtotal: cartTotal,
        total:    cartTotal,
        items: items.map(i => ({
          producto_id:     i.product.id,
          nombre_producto: i.product.nombre,
          codigo_producto: i.product.codigo,
          precio_unitario: i.product.precio,
          precio_final:    i.product.precio,
          cantidad:        i.quantity,
          subtotal:        i.product.precio * i.quantity,
        })),
      });
    } catch (err) {
      console.error('[ByteX] Error al guardar cotización:', err);
    }
    setLoading(false);
    if (ok) finish();
    else setSaveError(true);
  };

  return (
    <>
      <main style={{ paddingTop: 80, minHeight: "100vh" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px 80px" }}>

          {/* Title */}
          <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, letterSpacing: "-0.02em", marginBottom: 36 }}>
            {step === "success" ? "¡Cotización enviada!" : "Resumen de cotización"}
          </h1>

          {/* ── SUCCESS ── */}
          {step === "success" && (
            <div style={{ textAlign: "center", padding: "60px 24px" }}>
              <div style={{ position: "relative", width: 200, height: 56, margin: "0 auto 28px" }}>
                <Image src="/logo.png" alt="ByteX Store" fill style={{ objectFit: "contain" }} />
              </div>
              <CheckCircle size={48} style={{ color: "var(--success)", marginBottom: 16 }} />
              <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 10 }}>¡Gracias!</h2>
              <p style={{ fontSize: 14, color: "var(--text-3)", marginBottom: 28, lineHeight: 1.7 }}>
                Se abrió WhatsApp con tu cotización lista. Si no se abrió automáticamente, usa el botón de abajo.
              </p>
              <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                <a href={waLink(sentMsg)} target="_blank" rel="noopener noreferrer" className="btn-ghost"
                  style={{ display: "inline-flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
                  <MessageCircle size={15} /> Abrir WhatsApp
                </a>
                <Link href="/catalogo" className="btn-primary" style={{ textDecoration: "none" }}>
                  Seguir explorando
                </Link>
              </div>
            </div>
          )}

          {/* Avisos de cambios desde la última visita */}
          {step !== "success" && changes.length > 0 && (
            <div className="card" style={{ padding: "14px 18px", marginBottom: 20, display: "flex", gap: 12,
              borderColor: "var(--warning)", fontSize: 13, color: "var(--text-2)", lineHeight: 1.6 }}>
              <AlertTriangle size={16} style={{ color: "var(--warning)", flexShrink: 0, marginTop: 3 }} />
              <div>{changes.map(c => <div key={c}>{c}</div>)}</div>
            </div>
          )}

          {/* ── CART ── */}
          {step === "cart" && mounted && (
            <>
              {items.length === 0 ? (
                <div style={{ textAlign: "center", padding: "60px 24px", color: "var(--text-3)" }}>
                  <ShoppingCart size={40} strokeWidth={1.5} style={{ color: "var(--text-3)", marginBottom: 16 }} />
                  <div style={{ fontSize: 16, fontWeight: 600, color: "var(--text-2)", marginBottom: 16 }}>
                    Tu cotización está vacía
                  </div>
                  <Link href="/catalogo" style={{ textDecoration: "none" }}>
                    <button className="btn-primary">Ver equipos</button>
                  </Link>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 28, alignItems: "start" }}
                  className="cart-grid">

                  {/* Items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {items.map(item => (
                      <div key={item.product.id} className="card"
                        style={{ padding: "16px 20px", display: "flex", gap: 16, alignItems: "center" }}>
                        <div style={{ width: 72, height: 72, borderRadius: 8, overflow: "hidden",
                          flexShrink: 0, position: "relative", background: "var(--bg-elevated)" }}>
                          <Image src={item.product.fotos_tienda?.[0] || PLACEHOLDER}
                            alt={item.product.nombre} fill style={{ objectFit: "cover" }}
                            unoptimized sizes="72px" />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4,
                            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {item.product.nombre}
                          </div>
                          <div style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)", marginBottom: 10 }}>
                            ${item.product.precio.toFixed(2)} c/u
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                            <button aria-label={`Quitar una unidad de ${item.product.nombre}`}
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              style={{ width: 26, height: 26, borderRadius: 5, cursor: "pointer",
                                border: "1px solid var(--border-solid)", background: "var(--bg-elevated)",
                                color: "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Minus size={10} />
                            </button>
                            <span style={{ fontSize: 13, fontFamily: "var(--font-mono)", minWidth: 22, textAlign: "center" }}>
                              {item.quantity}
                            </span>
                            <button aria-label={`Agregar una unidad de ${item.product.nombre}`}
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              disabled={item.quantity >= maxQuantity(item.product)}
                              title={item.quantity >= maxQuantity(item.product) ? "No hay más unidades disponibles" : undefined}
                              style={{ width: 26, height: 26, borderRadius: 5,
                                cursor: item.quantity >= maxQuantity(item.product) ? "not-allowed" : "pointer",
                                opacity: item.quantity >= maxQuantity(item.product) ? 0.4 : 1,
                                border: "1px solid var(--border-solid)", background: "var(--bg-elevated)",
                                color: "var(--text-3)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                              <Plus size={10} />
                            </button>
                            <button aria-label={`Eliminar ${item.product.nombre}`}
                        onClick={() => removeItem(item.product.id)}
                              style={{ width: 26, height: 26, borderRadius: 5, cursor: "pointer",
                                border: "1px solid rgba(255,71,87,0.3)", background: "rgba(255,71,87,0.08)",
                                color: "var(--error)", display: "flex", alignItems: "center", justifyContent: "center",
                                marginLeft: 4 }}>
                              <Trash2 size={11} />
                            </button>
                          </div>
                        </div>
                        <span className="price-tag" style={{ fontSize: 18, flexShrink: 0 }}>
                          ${(item.product.precio * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Summary sidebar */}
                  <div className="card" style={{ padding: "20px", position: "sticky", top: 88 }}>
                    <div style={{ fontSize: 10, color: "var(--accent)", fontFamily: "var(--font-mono)",
                      letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>
                      Resumen
                    </div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
                      {items.map(i => (
                        <div key={i.product.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12 }}>
                          <span style={{ color: "var(--text-3)" }}>
                            {i.product.nombre.length > 22 ? i.product.nombre.slice(0, 22) + "…" : i.product.nombre} ×{i.quantity}
                          </span>
                          <span style={{ fontFamily: "var(--font-mono)" }}>
                            ${(i.product.precio * i.quantity).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="divider" style={{ marginBottom: 16 }} />
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                      <span style={{ fontSize: 13, color: "var(--text-3)" }}>Total referencial</span>
                      <span className="price-tag" style={{ fontSize: 24 }}>${cartTotal.toFixed(2)}</span>
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-4)", marginBottom: 20, lineHeight: 1.5 }}>
                      Precios referenciales. Los descuentos se coordinan con nosotros.
                    </p>
                    <button className="btn-primary" onClick={() => setStep("form")}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                      <Send size={14} /> Solicitar cotización
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ── FORM ── */}
          {step === "form" && (
            <div style={{ maxWidth: 500 }}>
              <p style={{ color: "var(--text-3)", fontSize: 14, marginBottom: 28, lineHeight: 1.7 }}>
                Déjanos tus datos y te contactamos por WhatsApp para confirmar disponibilidad y coordinar la entrega.
              </p>
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {([
                  { key: "nombre",   label: "Nombre completo *",  required: true,  type: "text",  placeholder: "Tu nombre" },
                  { key: "whatsapp", label: "WhatsApp *",          required: true,  type: "text",  placeholder: "0999 999 999" },
                  { key: "email",    label: "Email (opcional)",    required: false, type: "email", placeholder: "tu@email.com" },
                ] as const).map(f => (
                  <div key={f.key}>
                    <label style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)",
                      letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                      {f.label}
                    </label>
                    <input className="input-field" required={f.required} type={f.type}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 11, color: "var(--text-3)", fontFamily: "var(--font-mono)",
                    letterSpacing: "0.08em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>
                    Notas adicionales
                  </label>
                  <textarea className="input-field" rows={3}
                    placeholder="¿Alguna pregunta específica sobre los equipos?"
                    value={form.notas}
                    onChange={e => setForm({ ...form, notas: e.target.value })}
                    style={{ resize: "vertical" as const }} />
                </div>
                {saveError && (
                  <div role="alert" style={{ padding: "12px 14px", borderRadius: 8, fontSize: 13, lineHeight: 1.6,
                    color: "var(--error)", background: "rgba(220,38,38,0.08)", border: "1px solid rgba(220,38,38,0.25)" }}>
                    No pudimos registrar tu cotización. Vuelve a intentarlo o{" "}
                    <button type="button" onClick={finish}
                      style={{ background: "none", border: "none", padding: 0, color: "inherit",
                        textDecoration: "underline", cursor: "pointer", font: "inherit" }}>
                      envíala solo por WhatsApp
                    </button>.
                  </div>
                )}
                <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                  <button type="button" className="btn-ghost" onClick={() => setStep("cart")} style={{ flex: 1 }}>
                    ← Volver
                  </button>
                  <button type="submit" className="btn-primary" disabled={loading}
                    style={{ flex: 2, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {loading ? "Enviando…" : <><MessageCircle size={15} /> Enviar por WhatsApp</>}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <style>{`
        @media (max-width: 768px) {
          .cart-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
}
