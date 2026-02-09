import type { Metadata } from "next";
import Footer from "@/components/Footer";
import MobileStickyBar from "@/components/MobileStickyBar";
import TextUsButton from "@/components/TextUsButton";
import Navbar from "@/components/Navbar";
import { getSettings } from "@/lib/siteData";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    title: settings.seo.title,
    description: settings.seo.description,
    openGraph: {
      title: settings.seo.title,
      description: settings.seo.description,
      images: [settings.seo.ogImage],
      type: "website",
    },
  };
}

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSettings();
  const bookingHref =
    settings.booking.mode === "external" && settings.booking.bookingUrl
      ? settings.booking.bookingUrl
      : "/book";

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar
        businessName={settings.businessInfo.name}
        phone={settings.businessInfo.phone}
        bookingHref={bookingHref}
      />
      <main className="flex-1">{children}</main>
      <Footer
        businessName={settings.businessInfo.name}
        tagline={settings.businessInfo.tagline}
        serviceAreaSummary={`${settings.serviceArea.center} • ${settings.serviceArea.radiusMiles} mile radius`}
        phone={settings.businessInfo.phone}
        email={settings.businessInfo.email}
        socials={settings.socials}
      />
      <TextUsButton smsPhone={settings.businessInfo.smsPhone} />
      <MobileStickyBar phone={settings.businessInfo.phone} bookingHref={bookingHref} />
    </div>
  );
}
