"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Search, User, Menu, X } from "lucide-react";
import { useCart } from "@/lib/cart-store";
import CartDrawer from "./CartDrawer";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/",           label: "Inicio" },
  { href: "/catalogo",   label: "Catálogo" },
  { href: "/catalogo?oferta=true", label: "Ofertas" },
  { href: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`, label: "Soporte", external: true },
];

export default function Navbar() {
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search, setSearch]         = useState("");
  const [mounted, setMounted]       = useState(false);
  const { itemCount, openCart }     = useCart();

  // Esperar a que el cliente monte antes de leer el carrito (evita hydration mismatch)
  useEffect(() => { setMounted(true); }, []);

  const count = mounted ? itemCount() : 0;

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) window.location.href = `/catalogo?q=${encodeURIComponent(search)}`;
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: scrolled ? "var(--bg-nav-scrolled)" : "var(--bg-nav)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border-solid)",
        boxShadow: scrolled ? "0 2px 20px rgba(0,0,0,0.5)" : "none",
        transition: "all 0.3s",
        overflow: "visible",
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 16px" }}>
          <div style={{ display: "flex", alignItems: "center", height: 80, gap: 20 }}>

            {/* Logo */}
            <Link href="/" style={{ textDecoration: "none", flexShrink: 0, display: "flex", alignItems: "center" }}>
              <div style={{
                position: "relative", height: 130, width: 450,
                transition: "opacity 0.25s",
              }} className="logo-nav">
                <Image src="/logo.png" alt="ByteX Store" fill priority
                  style={{ objectFit: "contain", objectPosition: "left center" }} sizes="160px" />
              </div>
            </Link>

            {/* Nav links — desktop */}
            <div style={{ display: "flex", gap: 2, flex: 1, justifyContent: "center" }} className="hide-mobile">
              {NAV.map(item => (
                item.external
                  ? <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                      style={{ color: "var(--text-3)", textDecoration: "none", fontSize: 13, fontWeight: 500,
                        padding: "6px 14px", borderRadius: 6, transition: "all 0.14s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
                    >{item.label}</a>
                  : <Link key={item.label} href={item.href}
                      style={{ color: "var(--text-3)", textDecoration: "none", fontSize: 13, fontWeight: 500,
                        padding: "6px 14px", borderRadius: 6, transition: "all 0.14s" }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = "var(--accent)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = "var(--text-3)"; }}
                    >{item.label}</Link>
              ))}
            </div>

            {/* Right side */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", marginLeft: "auto" }}>
              {/* Search */}
              <form onSubmit={handleSearch} className="search-bar hide-mobile">
                <Search size={14} style={{ color: "var(--text-4)", flexShrink: 0 }} />
                <input placeholder="Buscar equipos..."
                  value={search} onChange={e => setSearch(e.target.value)} />
              </form>

              {/* Cart */}
              <button onClick={openCart} style={{
                position: "relative", width: 38, height: 38, borderRadius: 8,
                background: count > 0 ? "var(--accent-dim)" : "var(--bg-elevated)",
                border: count > 0 ? "1px solid var(--accent)" : "1px solid var(--border-solid)",
                color: count > 0 ? "var(--accent)" : "var(--text-3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", transition: "all 0.15s",
              }}>
                <ShoppingCart size={16} />
                {count > 0 && (
                  <span style={{
                    position: "absolute", top: -6, right: -6,
                    width: 18, height: 18, borderRadius: "50%",
                    background: "var(--accent)", color: "var(--bg)",
                    fontSize: 9, fontWeight: 700, fontFamily: "var(--font-mono)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    border: "1.5px solid var(--bg)",
                  }}>{count}</span>
                )}
              </button>

              {/* Theme toggle */}
              <ThemeToggle />

              {/* Account icon */}
              <div style={{
                width: 38, height: 38, borderRadius: 8,
                background: "var(--bg-elevated)", border: "1px solid var(--border-solid)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--text-3)", cursor: "pointer",
              }} className="hide-mobile">
                <User size={16} />
              </div>

              {/* Mobile toggle */}
              <button onClick={() => setMobileOpen(!mobileOpen)} className="show-mobile" style={{
                width: 38, height: 38, borderRadius: 8,
                background: "var(--bg-elevated)", border: "1px solid var(--border-solid)",
                color: "var(--text-3)", cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                {mobileOpen ? <X size={16} /> : <Menu size={16} />}
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div style={{ padding: "8px 0 16px", borderTop: "1px solid var(--border-solid)" }}>
              <form onSubmit={handleSearch} style={{ padding: "8px 0 12px", display: "flex", gap: 8 }}>
                <input className="input-field" placeholder="Buscar equipos..."
                  value={search} onChange={e => setSearch(e.target.value)} />
                <button type="submit" className="btn-primary" style={{ flexShrink: 0, padding: "10px 14px" }}>
                  <Search size={14} />
                </button>
              </form>
              {NAV.map(item => (
                item.external
                  ? <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer"
                      style={{ display: "block", padding: "10px 12px", color: "var(--text-2)",
                        textDecoration: "none", fontSize: 14, borderRadius: 6 }}
                    >{item.label}</a>
                  : <Link key={item.label} href={item.href} onClick={() => setMobileOpen(false)}
                      style={{ display: "block", padding: "10px 12px", color: "var(--text-2)",
                        textDecoration: "none", fontSize: 14, borderRadius: 6 }}
                    >{item.label}</Link>
              ))}
            </div>
          )}
        </div>
      </nav>

      <CartDrawer />

      <style>{`
        .logo-nav:hover { opacity: 0.8; }
      `}</style>
    </>
  );
}
