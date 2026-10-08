import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const shop = process.env.SHOPIFY_STORE;
  const clientId = process.env.SHOPIFY_CLIENT_ID;
  const clientSecret = process.env.SHOPIFY_CLIENT_SECRET;

  if (!code || !shop || !clientId || !clientSecret) {
    return NextResponse.json({ error: "Parámetros inválidos o variables de entorno faltantes" }, { status: 400 });
  }

  // Intercambiar el code por un access token permanente
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
  });

  if (!tokenRes.ok) {
    return NextResponse.json({ error: "Error al obtener el token de Shopify" }, { status: 500 });
  }

  const { access_token } = await tokenRes.json();

  // Mostrar el token para que lo copies a .env.local
  return new NextResponse(
    `<html><body style="font-family:monospace;padding:40px;background:#0D0F1A;color:#00C8FF;">
      <h2>✅ Token obtenido exitosamente</h2>
      <p>Copia este token y agrégalo a tu <strong>.env.local</strong> como:</p>
      <pre style="background:#1a1c2a;padding:20px;border-radius:8px;color:#fff;word-break:break-all;">SHOPIFY_ACCESS_TOKEN=${access_token}</pre>
      <p style="color:#888">Una vez agregado al .env.local, ya no necesitas volver a este paso.</p>
    </body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
