import Container from "@/components/Container";
import LightboxGallery from "@/components/LightboxGallery";
import { getPublicGallery } from "@/lib/siteData";

export default async function GalleryPage() {
  const gallery = await getPublicGallery();

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
          <LightboxGallery images={gallery} />
        </Container>
      </section>
    </div>
  );
}
