import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <>
      <Navbar />
      <main style={{ paddingTop: 72, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center", padding: "80px 24px" }}>
          <div style={{ position: "relative", width: 220, height: 64, margin: "0 auto 32px" }}>
            <Image src="/logo.png" alt="ByteX Store" fill style={{ objectFit: "contain" }} priority />
          </div>
          <div
            style={{ fontSize: "clamp(80px, 15vw, 160px)", fontWeight: 900, color: "var(--accent)", opacity: 0.12, lineHeight: 1,
              fontFamily: "var(--font-mono)" }}
          >
            404
          </div>
          <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 900, marginBottom: 16, marginTop: -20 }}>
            Página no encontrada
          </h1>
          <p style={{ fontSize: 15, color: "var(--text-3)", marginBottom: 32, lineHeight: 1.7 }}>
            El equipo que buscas no está aquí. Explora nuestro catálogo completo.
          </p>
          <Link href="/catalogo" style={{ textDecoration: "none" }}>
            <button className="btn-primary">Ver catálogo</button>
          </Link>
        </div>
      </main>
    </>
  );
}
