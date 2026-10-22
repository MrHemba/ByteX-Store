"use client";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    // El script de layout.tsx ya aplicó el tema antes de pintar; aquí solo se sincroniza el icono
    setDark(document.documentElement.getAttribute("data-theme") === "dark");
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute("data-theme", next ? "dark" : "light");
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };

  return (
    <button
      onClick={toggle}
      title={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      aria-label={dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"}
      style={{
        width: 36,
        height: 36,
        borderRadius: 6,
        background: "rgba(255,255,255,0.07)",
        border: "1px solid rgba(255,255,255,0.12)",
        color: dark ? "#F59E0B" : "rgba(255,255,255,0.65)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        transition: "border-color 0.15s, color 0.15s, background 0.15s",
        flexShrink: 0,
      }}
    >
      {dark ? <Sun size={15} /> : <Moon size={15} />}
    </button>
  );
}
