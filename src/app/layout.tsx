import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";
import NumberInputGuard from "@/components/NumberInputGuard";
import ThemeSync from "@/components/ThemeSync";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

export const metadata: Metadata = {
  title: "Shimmer N Shine Detailing",
  description: "Premium mobile auto detailing with effortless booking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700&family=Inter:wght@400;500;600;700&family=Roboto:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <ThemeSync />
        <NumberInputGuard />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
