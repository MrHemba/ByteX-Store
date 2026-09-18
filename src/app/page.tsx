import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import CategoryPills from "@/components/CategoryPills";
import { getProducts } from "@/lib/supabase";
import { ArrowRight, ChevronRight } from "lucide-react";

const MOCK_PRODUCTS = [
  { id:"1", nombre:"Laptop HP ProBook 450 G8", descripcion_publica:"Intel Core i5 11va gen", precio:520, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{RAM:"8GB",CPU:"i5-11",Disco:"SSD 256GB"}, categoria:"Laptops", stock:2, codigo:"LAP-001" },
  { id:"2", nombre:"Dell Latitude 5510 Core i7", descripcion_publica:"Empresarial Full HD", precio:680, fotos_tienda:[], condicion:"reacondicionado" as const, especificaciones:{RAM:"16GB",CPU:"i7-10",Disco:"SSD 512GB"}, categoria:"Laptops", stock:1, codigo:"LAP-002" },
  { id:"3", nombre:"PC Lenovo ThinkCentre M720", descripcion_publica:"Escritorio empresarial", precio:380, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{RAM:"8GB",CPU:"i5-8",Disco:"HDD 500GB"}, categoria:"PCs", stock:3, codigo:"PC-001" },
  { id:"4", nombre:"Impresora Epson L3150 WiFi", descripcion_publica:"Sistema tanque, multifunción", precio:195, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{Tipo:"Multifunción",WiFi:"Sí"}, categoria:"Impresoras", stock:2, codigo:"IMP-001" },
  { id:"5", nombre:"Laptop Asus VivoBook 15", descripcion_publica:"Ryzen 5, ideal estudiantes", precio:440, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{RAM:"8GB",CPU:"Ryzen 5",Disco:"SSD 256GB"}, categoria:"Laptops", stock:1, codigo:"LAP-003" },
  { id:"6", nombre:"Monitor Samsung 24\" Full HD", descripcion_publica:"Panel IPS, bordes delgados", precio:155, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{Tamaño:'24"',Panel:"IPS"}, categoria:"Monitores", stock:4, codigo:"MON-001" },
  { id:"7", nombre:"HP EliteBook 840 G6", descripcion_publica:"Ultrabook empresarial Core i7", precio:750, fotos_tienda:[], condicion:"reacondicionado" as const, especificaciones:{RAM:"16GB",CPU:"i7-8",Disco:"SSD 512GB"}, categoria:"Laptops", stock:1, codigo:"LAP-004" },
  { id:"8", nombre:"Impresora HP LaserJet M15a", descripcion_publica:"Láser monocromática compacta", precio:145, fotos_tienda:[], condicion:"segunda" as const, especificaciones:{Tipo:"Láser",Color:"Mono"}, categoria:"Impresoras", stock:3, codigo:"IMP-002" },
];

const CATS = [
  { id:"laptop",    label:"Laptops" },
  { id:"pc",        label:"PCs" },
  { id:"impresora", label:"Impresoras" },
  { id:"monitor",   label:"Monitores" },
  { id:"accesorio", label:"Accesorios" },
];

const CAT_CARDS = [
  { id:"laptop",    label:"Laptops",            desc:"Portátiles empresariales y personales",  icon:"💻", color:"#0066FF" },
  { id:"pc",        label:"PCs Escritorio",     desc:"Equipos de escritorio y all-in-one",     icon:"🖥️", color:"#7C3AED" },
  { id:"impresora", label:"Impresoras",         desc:"Láser, tinta y multifuncionales",        icon:"🖨️", color:"#059669" },
  { id:"monitor",   label:"Monitores",          desc:"Pantallas Full HD e IPS de calidad",     icon:"🖵",  color:"#00C8FF" },
  { id:"accesorio", label:"Accesorios",         desc:"Teclados, ratones, cables y más",        icon:"🖱️", color:"#F59E0B" },
  { id:"servicio",  label:"Servicios Digitales",desc:"Software, licencias y soporte técnico",  icon:"⚡", color:"#EC4899" },
];

export default async function Home() {
  let products: any[] = [];
  try { products = await getProducts(); } catch {}
  const display = products.length > 0 ? products.slice(0, 8) : MOCK_PRODUCTS;

  return (
    <>
      <main style={{ paddingTop: 80 }}>

        {/* ── HERO ── */}
        <section style={{ borderBottom: "1px solid var(--border-solid)", padding: "72px 24px 68px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 420px", gap: 48, alignItems: "center" }} className="hero-grid">

            {/* Texto */}
            <div className="hero-text">
              <p className="hero-label">Ecuador · Segunda mano</p>
              <h1 className="hero-title">
                Tecnología<br />en buenas manos.
              </h1>
              <p className="hero-sub">Laptops, PCs e impresoras revisadas. Garantía incluida.</p>
              <div style={{ display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }} className="hero-ctas">
                <Link href="/catalogo" style={{ textDecoration: "none" }}>
                  <button className="btn-primary" style={{ padding: "13px 28px", fontSize: 14 }}>
                    Ver catálogo
                  </button>
                </Link>
                <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, quiero consultar sobre los equipos disponibles")}`}
                  target="_blank" rel="noopener noreferrer" className="hero-wa-link">
                  Consultar por WhatsApp <ArrowRight size={14} />
                </a>
              </div>
            </div>

            {/* Devices flotando */}
            <div className="hide-mobile" style={{ position: "relative", width: 500, height: 420, flexShrink: 0 }}>

              {/* Laptop — centro arriba */}
              <div className="dev-float-a" style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: 320 }}>
                <div style={{ borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.5)" }}>
                  <Image src="/hero-laptop.jpg" alt="Laptop" width={320} height={210} style={{ objectFit: "cover", display: "block", width: "100%", height: "auto" }} />
                </div>
                <div style={{ height: 6, background: "radial-gradient(ellipse, rgba(0,0,0,0.4) 0%, transparent 70%)", marginTop: 8 }} />
              </div>

              {/* Impresora — abajo izquierda */}
              <div className="dev-float-b" style={{ position: "absolute", bottom: 20, left: 0, width: 210 }}>
                <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.45)" }}>
                  <Image src="/hero-impresora.jpg" alt="Impresora" width={210} height={162} style={{ objectFit: "cover", display: "block", width: "100%", height: "auto" }} />
                </div>
                <div style={{ height: 5, background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)", marginTop: 6 }} />
              </div>

              {/* CPU — abajo derecha */}
              <div className="dev-float-c" style={{ position: "absolute", bottom: 10, right: 0, width: 185 }}>
                <div style={{ borderRadius: 14, overflow: "hidden", boxShadow: "0 16px 40px rgba(0,0,0,0.45)" }}>
                  <Image src="/hero-cpu.jpg" alt="CPU" width={185} height={185} style={{ objectFit: "cover", display: "block", width: "100%", height: "auto" }} />
                </div>
                <div style={{ height: 5, background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%)", marginTop: 6 }} />
              </div>

            </div>

          </div>
        </section>
        <style>{`
          @media(max-width:768px){ .hero-grid{ grid-template-columns:1fr !important; } }
          .hero-wa-link{ display:flex; align-items:center; gap:6px; font-size:14px; font-weight:600; color:var(--text-2); text-decoration:none; transition:color 0.15s; }
          .hero-wa-link:hover{ color:var(--accent); }
          @keyframes floatA { 0%,100%{ transform:translateX(-50%) translateY(0);    } 50%{ transform:translateX(-50%) translateY(-14px); } }
          @keyframes floatB { 0%,100%{ transform:translateY(0);    } 50%{ transform:translateY(-10px); } }
          @keyframes floatC { 0%,100%{ transform:translateY(0);    } 50%{ transform:translateY(-12px); } }
          .dev-float-a{ animation: floatA 4s ease-in-out infinite; }
          .dev-float-b{ animation: floatB 4.6s 0.4s ease-in-out infinite; }
          .dev-float-c{ animation: floatC 3.8s 0.9s ease-in-out infinite; }
          @keyframes heroFade { from{ opacity:0; transform:translateY(10px); } to{ opacity:1; transform:translateY(0); } }
          .hero-label { font-size:11px; font-weight:600; letter-spacing:0.16em; text-transform:uppercase; color:var(--text-3); margin-bottom:18px; animation:heroFade 0.5s ease both; }
          .hero-title { font-size:clamp(38px,5vw,70px); font-weight:400; line-height:1.06; letter-spacing:-0.02em; margin-bottom:20px; animation:heroFade 0.5s 0.1s ease both; }
          .hero-sub   { font-size:15px; color:var(--text-2); margin-bottom:34px; line-height:1.65; animation:heroFade 0.5s 0.2s ease both; }
          .hero-ctas  { animation:heroFade 0.5s 0.3s ease both; }
        `}</style>


        {/* ── CATEGORÍAS DESTACADAS ── */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "60px 24px 0" }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                <div style={{ width: 3, height: 20, borderRadius: 2, background: "linear-gradient(180deg, var(--accent) 0%, var(--accent-2) 100%)" }} />
                <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--accent)" }}>Explora por categoría</span>
              </div>
              <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: "-0.01em" }}>Categorías destacadas</h2>
            </div>
            <Link href="/catalogo" style={{ textDecoration: "none", display: "flex", alignItems: "center",
              gap: 4, fontSize: 13, color: "var(--accent)", fontWeight: 600, opacity: 0.85 }}>
              Ver todo <ChevronRight size={14}/>
            </Link>
          </div>

          {/* Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 14 }} className="cat-grid">
            {CAT_CARDS.map(cat => (
              <Link key={cat.id} href={`/catalogo?cat=${cat.id}`} style={{ textDecoration: "none" }}>
                <div style={{
                  position: "relative", overflow: "hidden", cursor: "pointer",
                  background: "var(--bg-card)",
                  border: `1px solid var(--border-solid)`,
                  borderRadius: 14,
                  padding: "28px 20px 24px",
                  height: "100%",
                  display: "flex", flexDirection: "column", gap: 14,
                  ["--cat-color" as any]: cat.color,
                }}
                  className="cat-card"
                >
                  {/* Top accent line */}
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3,
                    background: `linear-gradient(90deg, ${cat.color} 0%, ${cat.color}44 100%)`,
                    borderRadius: "14px 14px 0 0" }} />

                  {/* Icon container */}
                  <div style={{
                    width: 48, height: 48, borderRadius: 12,
                    background: cat.color + "18",
                    border: `1px solid ${cat.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24,
                  }}>{cat.icon}</div>

                  {/* Text */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 5, letterSpacing: "-0.01em" }}>{cat.label}</div>
                    <div style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.5 }}>{cat.desc}</div>
                  </div>

                  {/* Arrow */}
                  <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11,
                    fontWeight: 700, color: cat.color, letterSpacing: "0.04em" }}>
                    Ver productos <ChevronRight size={13} />
                  </div>

                  {/* Glow orb */}
                  <div style={{ position: "absolute", bottom: -30, right: -30, width: 100, height: 100,
                    borderRadius: "50%", background: cat.color, opacity: 0.05, pointerEvents: "none" }} />
                </div>
              </Link>
            ))}
          </div>
          <style>{`
            .cat-card { transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s; }
            .cat-card:hover { transform: translateY(-4px); border-color: color-mix(in srgb, var(--cat-color) 50%, transparent) !important; box-shadow: 0 12px 32px color-mix(in srgb, var(--cat-color) 12%, transparent); }
            @media(max-width:1024px){ .cat-grid{ grid-template-columns: repeat(3,1fr) !important; } }
            @media(max-width:640px){  .cat-grid{ grid-template-columns: repeat(2,1fr) !important; } }
          `}</style>
        </section>

        {/* ── PRODUCTOS ── */}
        <section style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 24px 80px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <h2 style={{ fontSize: 18, fontWeight: 700 }}>Equipos disponibles</h2>
            <Link href="/catalogo" style={{ textDecoration: "none", display: "flex", alignItems: "center",
              gap: 4, fontSize: 13, color: "var(--accent)", fontWeight: 500 }}>
              Ver todos <ChevronRight size={14}/>
            </Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
            {display.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      </main>

      {/* WhatsApp FAB */}
      <a href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`}
        target="_blank" rel="noopener noreferrer" className="whatsapp-fab">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      <Footer />
    </>
  );
}
