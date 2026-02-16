import Container from "@/components/Container";
import { getSettings } from "@/lib/siteData";

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col gap-16 pb-24 pt-12">
      <section>
        <Container>
          <div className="max-w-3xl">
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Gallery
            </div>
            <h1 className="mt-3 text-4xl font-semibold">
              Before and after transformations.
            </h1>
            <p className="mt-4 text-lg text-[var(--muted)]">
              Real results from real customers across the metro area.
            </p>
          </div>
        </Container>
      </section>
      <section>
        <Container>
          {settings.integrations.instagramEmbedUrl ? (
            <iframe
              src={settings.integrations.instagramEmbedUrl}
              className="snapwidget-widget snapwidget-embed"
              allowTransparency
              frameBorder={0}
              scrolling="no"
              style={{ border: "none", overflow: "hidden", width: "100%", height: "1700px" }}
              title="Gallery from Instagram"
            />
          ) : (
            <div className="rounded-3xl bg-[var(--surface2)] p-8 text-center">
              <h2 className="text-2xl font-semibold">Instagram gallery coming soon</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">
                We&apos;re currently showcasing our latest work on Instagram.
              </p>
              {settings.socials.instagram ? (
                <a
                  href={settings.socials.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white"
                >
                  View Instagram
                </a>
              ) : null}
            </div>
          )}
        </Container>
      </section>
    </div>
  );
}
