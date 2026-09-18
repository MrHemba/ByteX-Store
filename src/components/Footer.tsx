"use client";
import Link from "next/link";
import Image from "next/image";
import { MessageCircle, MapPin } from "lucide-react";

export default function Footer() {
  const wNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-solid)", marginTop: 80 }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "48px 24px 32px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 48, marginBottom: 40 }} className="footer-grid">
          <div>
            <div style={{ position: "relative", height: 70, width: 240, marginLeft: -6, marginBottom: 16 }} className="logo-nav">
              <Image src="/logo.png" alt="ByteX Store" fill style={{ objectFit: "contain", objectPosition: "left center" }} sizes="450px" />
            </div>
            <p style={{ fontSize: 13, color: "var(--text-3)", lineHeight: 1.7, maxWidth: 280, marginBottom: 20 }}>
              Laptops, PCs e impresoras de segunda mano revisados por expertos. Una tienda de H&G Solutions.
            </p>
            <a href={`https://wa.me/${wNum}`} target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "9px 16px",
                background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.25)",
                borderRadius: 8, color: "#25D366", fontSize: 13, fontWeight: 600, textDecoration: "none" }}>
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: 16 }}>Categorías</div>
            {["Laptops","PCs","Impresoras","Monitores","Accesorios"].map(item => (
              <Link key={item} href={`/catalogo?cat=${item.toLowerCase()}`}
                style={{ display: "block", padding: "5px 0", fontSize: 13, color: "var(--text-3)", textDecoration: "none", transition: "color 0.15s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--text-3)")}
              >{item}</Link>
            ))}
          </div>
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--text-4)", marginBottom: 16 }}>Contacto</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--text-3)", fontSize: 13 }}>
                <MapPin size={13} style={{ color: "var(--accent)", flexShrink: 0 }} /> Ecuador — A nivel nacional
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center", color: "var(--text-3)", fontSize: 13 }}>
                <MessageCircle size={13} style={{ color: "var(--accent)", flexShrink: 0 }} /> WhatsApp disponible
              </div>
            </div>
          </div>
        </div>
        <div style={{ paddingTop: 24, borderTop: "1px solid var(--border-solid)",
          display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
          <span style={{ fontSize: 12, color: "var(--text-4)" }}>© {year} ByteX Store · H&G Solutions</span>
          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <Link href="/privacidad"
              style={{ fontSize: 12, color: "var(--text-4)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-4)")}
            >Política de Privacidad</Link>
            <Link href="/terminos"
              style={{ fontSize: 12, color: "var(--text-4)", textDecoration: "none", transition: "color 0.15s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--accent)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--text-4)")}
            >Términos y Condiciones</Link>
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--success)", boxShadow: "0 0 6px var(--success)" }} />
              <span style={{ fontSize: 11, color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>online</span>
            </div>
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){.footer-grid{grid-template-columns:1fr!important;gap:28px!important}}`}</style>
    </footer>
  );
}
