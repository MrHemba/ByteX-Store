"use client";
import NextImage, { type ImageProps } from "next/image";
import { useState } from "react";

/** Fotos propias (public/productos): ya vienen en WebP liviano, no necesitan el optimizador de Next. */
const OWN = /^(\/productos\/|https?:\/\/(www\.)?bytexstore\.es\/productos\/)/;

/**
 * next/image para fotos de producto. Evita el optimizador cuando no hace falta y,
 * si el optimizador falla (p. ej. cuota mensual de Vercel agotada → 402), vuelve a
 * cargar la imagen original en lugar de dejarla rota.
 */
export default function ProductImage({ src, unoptimized, onError, ...rest }: ImageProps) {
  const [raw, setRaw] = useState(false);
  const s = typeof src === "string" ? src : "";
  const skip = !!unoptimized || raw || s.startsWith("data:") || OWN.test(s);
  return (
    <NextImage
      {...rest}
      src={src}
      unoptimized={skip}
      onError={(e) => {
        if (!skip) setRaw(true);
        onError?.(e);
      }}
    />
  );
}
