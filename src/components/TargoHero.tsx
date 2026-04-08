import Link from "next/link";

type TargoHeroProps = {
  bookingHref: string;
  phone: string;
};

const CLIP_PATH =
  "polygon(0 12px, 12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%)";

export default function TargoHero({ bookingHref, phone }: TargoHeroProps) {
  return (
    <section className="targo-hero relative isolate overflow-hidden bg-black text-white">
      {/* Background video */}
      <video
        className="absolute inset-0 -z-10 h-full w-full object-cover"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260227_042027_c4b2f2ea-1c7c-4d6e-9e3d-81a78063703f.mp4"
          type="video/mp4"
        />
      </video>

      {/* Content */}
      <div className="targo-hero__inner relative mx-auto flex min-h-[640px] w-full max-w-[1200px] flex-col px-8 pb-10 pt-6 md:min-h-[720px] md:px-16 md:pb-16 md:pt-10">
        {/* Top nav */}
        <div className="flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-white hover:text-white"
            aria-label="Shimmer N Shine home"
          >
            <svg
              width="34"
              height="34"
              viewBox="0 0 40 40"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M20 3 L34 11 V29 L20 37 L6 29 V11 Z"
                stroke="#ffffff"
                strokeWidth="2.2"
                fill="none"
                strokeLinejoin="round"
              />
              <path
                d="M13 22 L20 14 L27 22 M16 26 L20 22 L24 26"
                stroke="#EE3F2C"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="targo-wordmark text-[22px] font-bold lowercase tracking-[-0.04em]">
              shimmer
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="/"
              className="text-[13px] font-medium uppercase tracking-[0.08em] text-white/90 hover:text-white"
            >
              Home
            </Link>
            <Link
              href="/services"
              className="text-[13px] font-medium uppercase tracking-[0.08em] text-white/90 hover:text-white"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-[13px] font-medium uppercase tracking-[0.08em] text-white/90 hover:text-white"
            >
              Contact Us
            </Link>
          </nav>

          <Link
            href="/contact"
            className="targo-btn-sm inline-flex items-center justify-center bg-[#EE3F2C] px-5 py-2.5 text-[12px] font-semibold uppercase tracking-[0.08em] text-white transition-transform hover:-translate-y-[1px] hover:text-white"
            style={{ clipPath: CLIP_PATH }}
          >
            Contact Us
          </Link>
        </div>

        {/* Upper-third headline block */}
        <div className="mt-14 max-w-[720px] md:mt-20">
          <h1 className="targo-headline text-[42px] font-bold uppercase leading-[0.95] md:text-[64px]">
            Swift and Simple
            <br />
            Mobile Detailing
          </h1>

          <div className="mt-8">
            <Link
              href={bookingHref}
              className="targo-btn inline-flex items-center justify-center bg-[#EE3F2C] px-8 py-4 text-[13px] font-semibold uppercase tracking-[0.1em] text-white transition-transform hover:-translate-y-[1px] hover:text-white"
              style={{ clipPath: CLIP_PATH }}
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Spacer pushes consultation card to bottom */}
        <div className="flex-1" />

        {/* Bottom-left consultation card */}
        <div className="targo-glass relative mt-10 w-full max-w-[360px] overflow-hidden p-5">
          <div className="targo-glass__shine pointer-events-none absolute inset-0" />
          <div className="relative">
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/70">
              Book a Free
            </div>
            <div className="text-[20px] font-bold uppercase leading-tight tracking-[-0.02em] text-white">
              Consultation
            </div>
            <p className="mt-2 text-[12px] leading-relaxed text-white/70">
              Tell us about your vehicle. We&apos;ll bring the shine to your driveway.
            </p>
            <Link
              href={`tel:${phone}`}
              className="targo-btn-white mt-4 inline-flex items-center gap-2 bg-white px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.1em] text-black transition-transform hover:-translate-y-[1px] hover:text-black"
              style={{ clipPath: CLIP_PATH }}
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92Z" />
              </svg>
              Book a Call
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
