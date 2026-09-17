import Link from "next/link";
import Footer from "@/components/Footer";
import { Shield, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Política de Privacidad — ByteX Store",
  description: "Política de privacidad y tratamiento de datos personales de ByteX Store, una tienda de H&G Solutions Ecuador.",
};

const LAST_UPDATED = "17 de septiembre de 2025";

export default function PrivacidadPage() {
  return (
    <>
      <main style={{ paddingTop: 72, minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-solid)", padding: "48px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Link href="/" style={{ fontSize: 12, color: "var(--text-4)", textDecoration: "none" }}>Inicio</Link>
              <ChevronRight size={12} style={{ color: "var(--text-4)" }} />
              <span style={{ fontSize: 12, color: "var(--accent)" }}>Privacidad</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-dim)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Shield size={22} style={{ color: "var(--accent)" }} />
              </div>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.02em" }}>
                Política de Privacidad
              </h1>
            </div>
            <p style={{ fontSize: 13, color: "var(--text-4)", fontFamily: "var(--font-mono)" }}>
              Última actualización: {LAST_UPDATED}
            </p>
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 800, margin: "0 auto", padding: "48px 24px 80px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>

            <Section title="1. Responsable del tratamiento">
              <p>
                <strong>ByteX Store</strong> es una tienda en línea operada por <strong>H&G Solutions</strong>,
                empresa con actividad comercial en Ecuador. Para consultas relacionadas con el tratamiento de sus
                datos personales puede contactarnos a través de WhatsApp o los medios indicados en nuestro sitio web.
              </p>
            </Section>

            <Section title="2. Datos que recopilamos">
              <p>Recopilamos la siguiente información según el contexto de su interacción con nosotros:</p>
              <List items={[
                "Nombre completo, número de WhatsApp y correo electrónico al enviar una solicitud de cotización.",
                "Productos seleccionados y cantidades del carrito de compras (almacenados localmente en su navegador).",
                "Datos de navegación anónimos mediante Google Analytics (páginas visitadas, duración de sesión, dispositivo, país).",
                "Datos de comportamiento y eventos mediante Google Tag Manager para medir la eficacia de nuestro sitio.",
              ]} />
            </Section>

            <Section title="3. Finalidad del tratamiento">
              <p>Utilizamos sus datos para las siguientes finalidades:</p>
              <List items={[
                "Procesar y gestionar sus solicitudes de cotización y atención al cliente.",
                "Contactarle por WhatsApp para confirmar disponibilidad, precios y coordinar la entrega.",
                "Mejorar la experiencia de navegación y el rendimiento de la tienda en línea.",
                "Analizar el tráfico del sitio web de forma agregada y anónima (sin identificar personas).",
                "Cumplir con las obligaciones legales aplicables en Ecuador.",
              ]} />
            </Section>

            <Section title="4. Base legal del tratamiento">
              <p>
                El tratamiento de sus datos se ampara en: (a) la ejecución de una relación precontractual o
                contractual cuando solicita una cotización; (b) su consentimiento explícito para el uso de
                cookies analíticas; y (c) el interés legítimo de mejorar nuestros servicios, en cumplimiento
                con la <strong>Ley Orgánica de Protección de Datos Personales del Ecuador</strong> (LOPDP).
              </p>
            </Section>

            <Section title="5. Cookies y tecnologías de seguimiento">
              <p>
                Nuestro sitio utiliza cookies de terceros para análisis:
              </p>
              <List items={[
                "Google Analytics (GA4 — G-QRRGT5D3VT): mide visitas, páginas vistas y comportamiento general de navegación de forma anónima.",
                "Google Tag Manager (GTM-N6GJS9VQ): gestiona las etiquetas de seguimiento del sitio.",
              ]} />
              <p style={{ marginTop: 12 }}>
                Estas herramientas no recopilan información que le identifique personalmente sin su
                consentimiento. Puede desactivar las cookies analíticas desde la configuración de su navegador
                o instalando el complemento de inhabilitación de Google Analytics.
              </p>
            </Section>

            <Section title="6. Conservación de los datos">
              <p>
                Los datos de cotizaciones se conservan durante el tiempo necesario para gestionar su solicitud
                y, posteriormente, el plazo mínimo exigido por la normativa tributaria y comercial ecuatoriana
                (generalmente 7 años). Los datos de navegación anónimos se conservan según los plazos
                establecidos por Google Analytics (por defecto, 14 meses).
              </p>
            </Section>

            <Section title="7. Compartición con terceros">
              <p>
                No vendemos ni cedemos sus datos personales a terceros con fines comerciales. Podemos compartir
                información con:
              </p>
              <List items={[
                "Google LLC, como proveedor de servicios de analítica web, bajo sus propias políticas de privacidad.",
                "Autoridades públicas ecuatorianas cuando la ley así lo exija.",
              ]} />
            </Section>

            <Section title="8. Sus derechos">
              <p>
                De conformidad con la LOPDP, usted tiene derecho a:
              </p>
              <List items={[
                "Acceder a los datos personales que tenemos sobre usted.",
                "Rectificar datos inexactos o incompletos.",
                "Solicitar la eliminación de sus datos cuando ya no sean necesarios.",
                "Oponerse al tratamiento de sus datos en determinadas circunstancias.",
                "Solicitar la limitación del tratamiento.",
                "Presentar una reclamación ante la Dirección Nacional de Registro de Datos Públicos (DINARDAP).",
              ]} />
              <p style={{ marginTop: 12 }}>
                Para ejercer cualquiera de estos derechos, contáctenos a través de WhatsApp indicando su
                solicitud y adjuntando una copia de su documento de identidad.
              </p>
            </Section>

            <Section title="9. Seguridad">
              <p>
                Adoptamos medidas técnicas y organizativas razonables para proteger sus datos frente a
                accesos no autorizados, pérdida o divulgación indebida. La información de cotizaciones se
                almacena en Supabase (infraestructura en la nube con cifrado en tránsito y en reposo).
              </p>
            </Section>

            <Section title="10. Cambios en esta política">
              <p>
                Podemos actualizar esta política periódicamente. La fecha de última actualización se indica
                en la parte superior. Le recomendamos revisarla cada vez que visite nuestro sitio.
              </p>
            </Section>

            {/* Contact CTA */}
            <div style={{ padding: "28px 32px", background: "var(--bg-elevated)", border: "1px solid var(--border-solid)", borderRadius: 12, marginTop: 8 }}>
              <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 16 }}>
                ¿Tiene preguntas sobre cómo tratamos sus datos? Escríbanos directamente.
              </p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, tengo una consulta sobre la política de privacidad de ByteX Store.")}`}
                target="_blank" rel="noopener noreferrer"
                style={{ textDecoration: "none" }}
              >
                <button className="btn-outline" style={{ fontSize: 13 }}>
                  Contactar por WhatsApp
                </button>
              </a>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 style={{ fontSize: 17, fontWeight: 800, marginBottom: 14, color: "var(--text)", letterSpacing: "-0.01em" }}>
        {title}
      </h2>
      <div style={{ fontSize: 14, color: "var(--text-2)", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 10 }}>
        {children}
      </div>
    </section>
  );
}

function List({ items }: { items: string[] }) {
  return (
    <ul style={{ paddingLeft: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 8 }}>
      {items.map((item, i) => (
        <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
          <span style={{ color: "var(--accent)", marginTop: 6, flexShrink: 0, fontSize: 8 }}>◆</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
