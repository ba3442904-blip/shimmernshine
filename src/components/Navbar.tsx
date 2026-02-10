"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import Button from "@/components/Button";
import ThemeToggle from "@/components/ThemeToggle";
import Container from "@/components/Container";
import { CloseIcon, MenuIcon } from "@/components/Icons";

const links = [
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Gallery", href: "/gallery" },
  { label: "Reviews", href: "/reviews" },
  { label: "Service Area", href: "/service-area" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar({
  businessName,
  phone,
  bookingHref,
}: {
  businessName: string;
  phone: string;
  bookingHref: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="navbar sticky top-0 z-50 border-b border-[var(--divider)] bg-[color-mix(in srgb, var(--bg) 92%, transparent)] backdrop-blur">
      <Container>
        <div className="nav-row flex items-center justify-center gap-4 py-3 lg:gap-6 lg:py-4">
          <div className="brand-left flex items-center gap-2">
            <Link href="/" className="inline-flex items-center justify-center text-[var(--text)]">
              <span className="mobile-logo relative flex h-16 w-36 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border2)] bg-[var(--surface2)] shadow-sm sm:h-20 sm:w-48 lg:h-32 lg:w-80">
                <Image
                  src="/shimmernshine-logo.jpg"
                  alt="Shimmer N Shine Detailing logo"
                  width={320}
                  height={128}
                  className="h-full w-full object-cover"
                  priority
                />
              </span>
            </Link>

            <button
              type="button"
              className="nav-toggle inline-flex items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] p-2 text-[var(--text)] shadow-sm lg:hidden"
              aria-label="Open menu"
              aria-expanded={open}
              onClick={() => setOpen(true)}
            >
              <MenuIcon />
            </button>
            <ThemeToggle className="lg:hidden px-2 py-2 text-[10px]" />
          </div>

          <div className="hidden items-center justify-center gap-6 lg:flex lg:mx-auto">
            <nav className="flex items-center justify-center gap-6 text-sm font-semibold">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[var(--text)] hover:text-[var(--accent)] text-center"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
            <div className="flex items-center justify-center gap-3">
              <ThemeToggle />
              <Button href={`tel:${phone}`} variant="secondary">
                Call Now
              </Button>
              <Button href={bookingHref}>Book Now</Button>
            </div>
          </div>
        </div>
      </Container>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/50 lg:hidden">
          <div className="absolute left-0 right-0 top-0 rounded-b-3xl bg-[var(--surface)] p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Link href="/" className="text-lg font-semibold">
                {businessName}
              </Link>
              <button
                type="button"
                className="rounded-full border border-[var(--border)] p-2"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <CloseIcon />
              </button>
            </div>

            <div className="mt-6 grid gap-3 text-sm font-semibold">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl border border-[var(--border)] px-4 py-3"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 grid gap-3">
              <ThemeToggle />
              <Button href={`tel:${phone}`} variant="secondary">
                Call Now
              </Button>
              <Button href={bookingHref}>Book Now</Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
