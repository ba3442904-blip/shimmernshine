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

        <div className="mt-10 flex flex-col justify-between gap-3 border-t border-[var(--border)] pt-6 text-xs text-[var(--muted)] sm:flex-row">
          <div>© 2026 {businessName}. All rights reserved.</div>
          <div>
            Prices may vary based on vehicle condition and size. Travel fees may apply.
          </div>
        </div>
      </Container>
    </footer>
  );
}
