import type { Metadata } from "next";
import { Atkinson_Hyperlegible, Source_Serif_4, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import "@/shared/layout/layout.css";
import Footer from "@/shared/layout/Footer/Footer";
import { Providers } from "./providers";
import { themeInitScript } from "./theme-init";
import Script from "next/script";

const atkinson = Atkinson_Hyperlegible({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  variable: "--font-atkinson",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "600", "700"],
  variable: "--font-source-serif",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "TomeSphere - Discover Your Next Favorite Book",
  description:
    "A comprehensive book discovery platform with curated recommendations, curated collections, and personalized reading lists.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "TomeSphere",
  },
  icons: {
    apple: "/icon-192.png",
    icon: [
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  },
};

export const viewport = {
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${atkinson.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <Script
          id="theme-init-script"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: themeInitScript,
          }}
        />
      </head>
      <body className="antialiased font-sans" suppressHydrationWarning>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <main className="flex-1 flex flex-col">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
