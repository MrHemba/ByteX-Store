import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET() {
  const shop = process.env.SHOPIFY_STORE;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || "https://bytexstore.es"}/api/shopify/callback`;
  const scopes = "read_products,read_inventory";
  const state = "bytexstore_install";

  if (!shop || !clientId) {
    return NextResponse.json({ error: "Faltan variables de entorno SHOPIFY_STORE o SHOPIFY_CLIENT_ID" }, { status: 500 });
  }

  const authUrl = `https://${shop}/admin/oauth/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${state}`;

  return NextResponse.redirect(authUrl);
}
