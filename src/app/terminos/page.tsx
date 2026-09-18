import Link from "next/link";
import Footer from "@/components/Footer";
import { FileText, ChevronRight } from "lucide-react";

export const metadata = {
  title: "Términos y Condiciones — ByteX Store",
  description: "Términos y condiciones de uso de ByteX Store, tienda de tecnología de segunda mano de H&G Solutions Ecuador.",
};

const LAST_UPDATED = "17 de septiembre de 2025";

export default function TerminosPage() {
  return (
    <>
      <main style={{ paddingTop: 100, minHeight: "100vh" }}>

        {/* Header */}
        <div style={{ background: "var(--bg-elevated)", borderBottom: "1px solid var(--border-solid)", padding: "48px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
              <Link href="/" style={{ fontSize: 12, color: "var(--text-4)", textDecoration: "none" }}>Inicio</Link>
              <ChevronRight size={12} style={{ color: "var(--text-4)" }} />
              <span style={{ fontSize: 12, color: "var(--accent)" }}>Términos y Condiciones</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: 10, background: "var(--accent-dim)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileText size={22} style={{ color: "var(--accent)" }} />
              </div>
              <h1 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, letterSpacing: "-0.02em" }}>
                Términos y Condiciones
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

            <Section title="1. Aceptación de los términos">
              <p>
                Al acceder y utilizar el sitio web <strong>ByteX Store</strong> (en adelante, "el Sitio"),
                usted acepta quedar vinculado por estos Términos y Condiciones. Si no está de acuerdo con
                alguna parte de estos términos, le rogamos que no utilice el Sitio.
              </p>
              <p>
                ByteX Store es operado por <strong>H&G Solutions</strong>, empresa con domicilio en Ecuador.
              </p>
            </Section>

            <Section title="2. Descripción del servicio">
              <p>
                ByteX Store es una tienda en línea que ofrece equipos tecnológicos de segunda mano y
                reacondicionados (laptops, PCs, impresoras, monitores y accesorios), así como servicios
                digitales. El proceso de compra se gestiona mediante <strong>solicitudes de cotización</strong>:
              </p>
              <List items={[
                "El cliente agrega productos al carrito y envía sus datos de contacto.",
                "Un asesor de H&G Solutions contacta al cliente por WhatsApp para confirmar disponibilidad, precio final y condiciones de entrega.",
                "La venta se concreta directamente con el asesor; el sitio web no procesa pagos en línea.",
              ]} />
            </Section>

            <Section title="3. Precios y disponibilidad">
              <List items={[
                "Los precios publicados en el Sitio están expresados en dólares americanos (USD) e incluyen IVA cuando corresponda.",
                "Los precios son referenciales y pueden variar al momento de confirmar la cotización, según disponibilidad de stock.",
                "ByteX Store se reserva el derecho de modificar precios sin previo aviso.",
                "La disponibilidad de los productos mostrados no garantiza stock en tiempo real; la confirmación se realiza durante la atención por WhatsApp.",
              ]} />
            </Section>

            <Section title="4. Condición de los equipos">
              <p>Los equipos se clasifican según su estado:</p>
              <List items={[
                "Segunda mano: equipo usado en buen estado funcional, con posibles marcas de uso estético.",
                "Reacondicionado: equipo revisado, limpiado y reparado por técnicos de H&G Solutions para garantizar su correcto funcionamiento.",
                "Nuevo: equipo sin uso previo.",
              ]} />
              <p style={{ marginTop: 12 }}>
                Cada producto indica su condición en la ficha del catálogo. Le recomendamos leer la
                descripción y especificaciones antes de solicitar una cotización.
              </p>
            </Section>

            <Section title="5. Garantía">
              <List items={[
                "Los equipos reacondicionados incluyen garantía de funcionamiento según lo indicado en cada producto al momento de la venta.",
                "La garantía cubre defectos de funcionamiento, no daños causados por mal uso, golpes o líquidos.",
                "Para hacer efectiva la garantía, el cliente debe comunicarse con H&G Solutions a través de WhatsApp con el número de cotización.",
                "Los equipos de segunda mano pueden o no incluir garantía; esto se especifica en la cotización confirmada.",
              ]} />
            </Section>

            <Section title="6. Envíos y entrega">
              <List items={[
                "Realizamos envíos a nivel nacional dentro del Ecuador.",
                "Los costos y tiempos de envío se coordinan y acuerdan durante la atención por WhatsApp.",
                "ByteX Store no se responsabiliza por demoras causadas por empresas de transporte o factores externos.",
                "El cliente debe verificar el estado del equipo al momento de la recepción y reportar cualquier inconveniente dentro de las 24 horas siguientes.",
              ]} />
            </Section>

            <Section title="7. Devoluciones y cambios">
              <p>
                Aceptamos devoluciones o cambios dentro de los <strong>3 días hábiles</strong> posteriores
                a la recepción del equipo, siempre que:
              </p>
              <List items={[
                "El equipo presente un defecto de funcionamiento no mencionado en la descripción.",
                "El equipo recibido no coincida con las especificaciones confirmadas en la cotización.",
                "El equipo se encuentre en las mismas condiciones en que fue entregado (sin daños adicionales).",
              ]} />
              <p style={{ marginTop: 12 }}>
                No se aceptan devoluciones por cambio de opinión. Para iniciar un proceso de devolución,
                contáctenos por WhatsApp con su número de cotización.
              </p>
            </Section>

            <Section title="8. Propiedad intelectual">
              <p>
                Todo el contenido del Sitio (textos, imágenes, logotipos, diseño) es propiedad de
                H&G Solutions o cuenta con las licencias correspondientes. Queda prohibida su reproducción,
                distribución o uso comercial sin autorización expresa y por escrito.
              </p>
            </Section>

            <Section title="9. Limitación de responsabilidad">
              <p>ByteX Store / H&G Solutions no será responsable por:</p>
              <List items={[
                "Daños derivados del uso incorrecto de los equipos adquiridos.",
                "Interrupciones temporales del Sitio por mantenimiento o causas técnicas ajenas a nuestra voluntad.",
                "Pérdidas de datos o configuraciones previas en los equipos, ya que estos se entregan sin garantía de contenido digital anterior.",
                "Daños indirectos, incidentales o consecuentes derivados del uso del Sitio.",
              ]} />
            </Section>

            <Section title="10. Legislación aplicable">
              <p>
                Estos Términos y Condiciones se rigen por las leyes de la <strong>República del Ecuador</strong>.
                Cualquier controversia derivada de la interpretación o aplicación de estos términos se
                someterá a la jurisdicción de los tribunales competentes de Ecuador, renunciando las partes
                a cualquier otro fuero que pudiera corresponderles.
              </p>
            </Section>

            <Section title="11. Modificaciones">
              <p>
                H&G Solutions se reserva el derecho de modificar estos Términos y Condiciones en cualquier
                momento. Los cambios entrarán en vigor desde su publicación en el Sitio. El uso continuado
                del Sitio tras la publicación de cambios implica la aceptación de los nuevos términos.
              </p>
            </Section>

            {/* Contact CTA */}
            <div style={{ padding: "28px 32px", background: "var(--bg-elevated)", border: "1px solid var(--border-solid)", borderRadius: 12, marginTop: 8 }}>
              <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 16 }}>
                ¿Tiene dudas sobre nuestros términos o el proceso de compra? Escríbanos.
              </p>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, tengo una consulta sobre los términos y condiciones de ByteX Store.")}`}
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
