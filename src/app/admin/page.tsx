"use client";

import { useState } from "react";

export default function AdminPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [result, setResult] = useState<{ synced?: number; errors?: string[] } | null>(null);

  async function handleSync() {
    setStatus("loading");
    setResult(null);
    try {
      const res = await fetch("/api/admin/sync", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setResult(data);
        setStatus("success");
      } else {
        setResult({ errors: [data.error || "Error desconocido"] });
        setStatus("error");
      }
    } catch {
      setResult({ errors: ["No se pudo conectar con el servidor"] });
      setStatus("error");
    }
  }

  return (
    <main style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: "var(--bg-card)", border: "1px solid var(--border-solid)", borderRadius: 16, padding: "40px 48px", maxWidth: 480, width: "100%", textAlign: "center" }}>

        {/* Logo / título */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--accent)", marginBottom: 8 }}>
            Panel Admin
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>ByteX Store</h1>
          <p style={{ fontSize: 13, color: "var(--text-3)" }}>Gestión de productos Dropi</p>
        </div>

        {/* Botón sync */}
        <button
          onClick={handleSync}
          disabled={status === "loading"}
          style={{
            width: "100%",
            padding: "14px 24px",
            background: status === "loading" ? "var(--bg-elevated)" : "var(--accent)",
            color: status === "loading" ? "var(--text-3)" : "#000",
            border: "none",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            cursor: status === "loading" ? "not-allowed" : "pointer",
            transition: "opacity 0.15s",
            marginBottom: 24,
          }}
        >
          {status === "loading" ? "Sincronizando..." : "🔄 Sincronizar productos Dropi → ByteX"}
        </button>

        {/* Resultado */}
        {status === "success" && result && (
          <div style={{ background: "#0a2a1a", border: "1px solid #00C85533", borderRadius: 10, padding: "16px 20px", textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#00C855", marginBottom: 8 }}>✅ Sincronización completada</div>
            <div style={{ fontSize: 13, color: "var(--text-2)" }}>
              <strong style={{ color: "var(--accent)" }}>{result.synced}</strong> productos sincronizados desde Shopify
            </div>
            {result.errors && result.errors.length > 0 && (
              <div style={{ marginTop: 8, fontSize: 12, color: "#f87171" }}>
                Errores: {result.errors.join(", ")}
              </div>
            )}
          </div>
        )}

        {status === "error" && result && (
          <div style={{ background: "#2a0a0a", border: "1px solid #C8003333", borderRadius: 10, padding: "16px 20px", textAlign: "left" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f87171", marginBottom: 8 }}>❌ Error al sincronizar</div>
            <div style={{ fontSize: 12, color: "var(--text-3)" }}>{result.errors?.join(", ")}</div>
          </div>
        )}

        {/* Info */}
        <div style={{ marginTop: 32, padding: "16px", background: "var(--bg-elevated)", borderRadius: 10, textAlign: "left" }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--text-3)", marginBottom: 10 }}>¿Cómo funciona?</div>
          <ol style={{ fontSize: 12, color: "var(--text-3)", lineHeight: 1.8, paddingLeft: 18, margin: 0 }}>
            <li>Importa productos desde Dropi a tu Shopify</li>
            <li>Haz clic en "Sincronizar" aquí</li>
            <li>Los productos aparecen en ByteX Store automáticamente</li>
          </ol>
        </div>

      </div>
    </main>
  );
}
