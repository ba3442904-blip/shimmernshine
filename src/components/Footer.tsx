import Link from "next/link";
import Container from "@/components/Container";

export default function Footer({
  businessName,
  tagline,
  serviceAreaSummary,
  phone,
  email,
  socials,
}: {
  businessName: string;
  tagline: string;
  serviceAreaSummary: string;
  phone: string;
  email: string;
  socials: { instagram?: string; facebook?: string };
}) {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)] py-16">
      <Container>
        <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <div className="text-lg font-semibold">{businessName}</div>
            <p className="mt-3 max-w-sm text-sm text-[var(--muted)]">{tagline}</p>
            <div className="mt-4 text-sm text-[var(--muted)]">
              <div>{phone}</div>
              <div>{email}</div>
            </div>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="text-sm font-semibold">Quick links</div>
            <Link href="/services">Services</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/reviews">Reviews</Link>
            <Link href="/contact">Contact</Link>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="text-sm font-semibold">Service area</div>
            <p className="text-[var(--muted)]">{serviceAreaSummary}</p>
          </div>

          <div className="grid gap-2 text-sm">
            <div className="text-sm font-semibold">Social</div>
            {socials.instagram ? (
              <Link href={socials.instagram} target="_blank" rel="noreferrer">
                Instagram
              </Link>
            ) : null}
            {socials.facebook ? (
              <Link href={socials.facebook} target="_blank" rel="noreferrer">
                Facebook
              </Link>
            ) : null}
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-4 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            {socials.facebook ? (
              <Link
                href={socials.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition hover:border-[var(--border2)] hover:text-[var(--accent)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M13.5 8.5v-2c0-.7.4-1 1-1h2V3h-2.5C11.6 3 10 4.6 10 6.9v1.6H8v3h2V21h3v-9.5h2.4l.6-3H13.5Z"
                  />
                </svg>
              </Link>
            ) : null}
            {socials.instagram ? (
              <Link
                href={socials.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text)] transition hover:border-[var(--border2)] hover:text-[var(--accent)]"
              >
                <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                  <path
                    fill="currentColor"
                    d="M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Zm5 5.5A3.5 3.5 0 1 0 12 19a3.5 3.5 0 0 0 0-7Zm0 2A1.5 1.5 0 1 1 12 15a1.5 1.5 0 0 1 0-3Zm5.25-3.25a.75.75 0 1 0 0 1.5.75.75 0 0 0 0-1.5Z"
                  />
                </svg>
              </Link>
            ) : null}
          </div>
          <div>
            Prices may vary based on vehicle condition and size. Travel fees may apply.
          </div>
        </div>
      </Container>
    </footer>
  );
}
