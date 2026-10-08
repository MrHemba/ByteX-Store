import { NextResponse } from "next/server";

// Ruta proxy — llama a /api/shopify/sync con el secret desde el servidor
// El secret nunca se expone al cliente
export async function POST() {
  const secret = process.env.SHOPIFY_SYNC_SECRET;
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://bytexstore.es";

  if (!secret) {
    return NextResponse.json({ error: "SHOPIFY_SYNC_SECRET no configurado" }, { status: 500 });
  }

  const res = await fetch(`${base}/api/shopify/sync`, {
    headers: { Authorization: `Bearer ${secret}` },
    cache: "no-store",
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
