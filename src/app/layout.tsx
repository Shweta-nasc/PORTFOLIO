import type { Metadata, Viewport } from "next";
import { Inter, Sora, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { siteMeta, personal, links, education } from "@/data/config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#09090f" },
    { media: "(prefers-color-scheme: light)", color: "#f7f8fc" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(siteMeta.url),
  title: {
    default: siteMeta.title,
    template: `%s · ${personal.name}`,
  },
  description: siteMeta.description,
  keywords: [...siteMeta.keywords],
  authors: [{ name: personal.name }],
  creator: personal.name,
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteMeta.url,
    title: siteMeta.title,
    description: siteMeta.description,
    siteName: `${personal.name} — Portfolio`,
    // og:image is provided by the generated app/opengraph-image.tsx (Next
    // auto-injects it), so no static file is referenced here.
  },
  twitter: {
    card: "summary_large_image",
    title: siteMeta.title,
    description: siteMeta.description,
    // twitter:image comes from the generated app/twitter-image.tsx.
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  alternates: { canonical: siteMeta.url },
  category: "technology",
};

// Structured data — every field is sourced from the central config, nothing
// hardcoded here.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: personal.name,
  jobTitle: personal.jobTitle,
  email: personal.email,
  url: siteMeta.url,
  image: `${siteMeta.url}${personal.photo}`,
  address: { "@type": "PostalAddress", addressLocality: personal.location },
  sameAs: [
    links.github,
    links.linkedin,
    links.leetcode,
    links.codeforces,
    links.codechef,
    links.geeksforgeeks,
    links.twitter,
  ],
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: education.university,
  },
  knowsAbout: [...personal.expertise],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${inter.variable} ${sora.variable} ${jetbrains.variable} font-sans`}
      >
        <ThemeProvider>{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
