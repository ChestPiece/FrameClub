import Link from "next/link";
import { ContactForm } from "@/components/contact/contact-form";
import { SiteFooter } from "@/components/layout/site-footer";
import { ContactHero } from "@/components/contact/contact-hero";
import { FOOTBALL_FRAME_COPY, WHATSAPP_LINK } from "@/lib/content/copy-constants";

const KICKER: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 500,
  letterSpacing: "0.28em",
  textTransform: "uppercase",
};

type ContactPageProps = {
  searchParams: Promise<{ intent?: string; product?: string }>;
};

export default async function ContactPage({ searchParams }: ContactPageProps) {
  const params = await searchParams;
  const intentIsNotify = params.intent === "notify";
  const intentIsCustomFrame = params.intent === "custom-frame";
  const pageTitle = intentIsNotify
    ? "GET NOTIFIED"
    : intentIsCustomFrame
      ? FOOTBALL_FRAME_COPY.contactTitle
      : "OPEN A CONVERSATION";
  const chapterLabel = intentIsNotify
    ? "Notification · Restock alert"
    : intentIsCustomFrame
      ? "Brief · Football Frame Commission"
      : "Chapter One · Reach the Workshop";
  const subtitle = intentIsNotify
    ? `You requested updates for ${params.product ?? "an unavailable model"}. Drop your email and we will notify you the moment it returns to the bench.`
    : intentIsCustomFrame
      ? FOOTBALL_FRAME_COPY.contactSubtitle
      : "Commission a build, ask about a model, or send a brief. The workshop reads every message and replies within one working day.";

  return (
    <>
      <main id="main-content" className="scroll-margin-site-header pb-0">
        <ContactHero
          chapterLabel={chapterLabel}
          title={pageTitle}
          subtitle={subtitle}
        />

        {/* Body — form + info panel */}
        <section
          className="bg-bg-surface"
          style={{ padding: "80px 0 100px" }}
        >
          <div className="mx-auto" style={{ width: "min(calc(100% - 2rem), 80rem)" }}>
            <div className="contact-grid" style={{ gap: 80, alignItems: "start" }}>
              {/* LEFT — Form */}
              <div>
                <div
                  style={{
                    paddingBottom: 24,
                    marginBottom: 40,
                    borderBottom: "0.5px solid var(--border)",
                  }}
                >
                  <p className="font-body text-text-muted" style={KICKER}>
                    {intentIsNotify
                      ? "Notify form"
                      : intentIsCustomFrame
                        ? "Football brief"
                        : "Send a message"}
                  </p>
                </div>
                <ContactForm
                  intentIsNotify={intentIsNotify}
                  intentIsCustomFrame={intentIsCustomFrame}
                  productSlug={params.product}
                />
              </div>

              {/* RIGHT — Info panel */}
              <aside className="flex flex-col" style={{ gap: 48 }}>
                <InfoBlock
                  label="Workshop"
                  primary="Studio 04, Block-C"
                  secondary="Gulberg III · Lahore, 54000"
                />
                <InfoBlock
                  label="Email"
                  primary="hello@frameclub.pk"
                  href="mailto:hello@frameclub.pk"
                />
                <InfoBlock
                  label="WhatsApp"
                  primary="Direct to the workshop"
                  secondary="Reply within 1 working day"
                  href={WHATSAPP_LINK}
                  hrefLabel="Open chat →"
                />
                <div
                  style={{
                    borderTop: "0.5px solid var(--border)",
                    paddingTop: 32,
                  }}
                >
                  <p
                    className="font-body text-text-muted"
                    style={{ ...KICKER, marginBottom: 16 }}
                  >
                    Studio hours
                  </p>
                  <p
                    className="font-display uppercase text-text-primary"
                    style={{
                      fontSize: 20,
                      letterSpacing: "0.06em",
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    Mon — Sat
                    <br />
                    11:00 — 19:00 PKT
                  </p>
                </div>
              </aside>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />

      <style>{`
        .contact-grid {
          display: grid;
          grid-template-columns: 1fr;
        }
        @media (min-width: 900px) {
          .contact-grid {
            grid-template-columns: 1.4fr 0.8fr;
          }
        }
      `}</style>
    </>
  );
}

function InfoBlock({
  label,
  primary,
  secondary,
  href,
  hrefLabel,
}: {
  label: string;
  primary: string;
  secondary?: string;
  href?: string;
  hrefLabel?: string;
}) {
  return (
    <div>
      <p
        className="font-body text-text-muted"
        style={{ ...KICKER, marginBottom: 12 }}
      >
        {label}
      </p>
      <p
        className="font-display uppercase text-text-primary"
        style={{
          fontSize: 22,
          letterSpacing: "0.06em",
          lineHeight: 1.3,
          margin: 0,
        }}
      >
        {primary}
      </p>
      {secondary ? (
        <p
          className="font-body text-text-muted"
          style={{ fontSize: 14, lineHeight: 1.6, marginTop: 8 }}
        >
          {secondary}
        </p>
      ) : null}
      {href ? (
        <Link
          href={href}
          className="font-body text-text-muted hover:text-text-primary"
          style={{
            display: "inline-block",
            marginTop: 14,
            fontSize: 11,
            letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}
        >
          {hrefLabel ?? "Open →"}
        </Link>
      ) : null}
    </div>
  );
}
