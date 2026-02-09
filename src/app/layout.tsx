import type { Metadata } from "next";
import { Fraunces, Inter, Roboto } from "next/font/google";
import "./globals.css";
import "./mobile.css";
import NumberInputGuard from "@/components/NumberInputGuard";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-admin",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

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
      <body
        className={`${inter.variable} ${fraunces.variable} ${roboto.variable} antialiased`}
      >
        <NumberInputGuard />
        {children}
      </body>
    </html>
  );
}
