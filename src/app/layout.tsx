import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

// Viewport configuration for SEO
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0f0f0f" },
    { media: "(prefers-color-scheme: light)", color: "#0f0f0f" },
  ],
};

// Global metadata optimized for SEO + GEO
export const metadata: Metadata = {
  title: {
    default: "SkillBluff | Fake AI Skills Generator - Create Parody Skills",
    template: "%s | SkillBluff",
  },
  description: "Generate hilarious fake AI skills for Claude Code. Create parody MCP skills, shareable AI tools, and funny skill markdown. The original fake skill generator.",
  keywords: [
    "fake skills",
    "AI skill generator",
    "Claude Code parody",
    "MCP skills parody",
    "fake skill generator",
    "AI humor tools",
    "satirical AI skills",
    "funny AI markdown",
    "parody skills",
    "AI skill creator",
    "Claude Code skills",
    "MCP fake skills",
  ],
  authors: [{ name: "SkillBluff" }],
  creator: "SkillBluff",
  publisher: "SkillBluff",
  metadataBase: new URL("https://skillbluff.arizkuren.net"),
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://skillbluff.arizkuren.net",
    siteName: "SkillBluff",
    title: "SkillBluff | The Original Fake AI Skills Generator",
    description: "Create and share hilarious fake AI skills. Generate parody MCP skills for Claude Code with funny markdown output.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SkillBluff - Fake AI Skills Generator",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@skillbluff",
    creator: "@skillbluff",
    title: "SkillBluff | Fake AI Skills Generator",
    description: "Generate hilarious fake AI skills for Claude Code. Create parody MCP skills and share them with the world.",
    images: ["/og-image.png"],
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  category: "technology",
  classification: "Entertainment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Schema.org JSON-LD for Website */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "SkillBluff",
              url: "https://skillbluff.arizkuren.net",
              description: "Generate hilarious fake AI skills for Claude Code",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://skillbluff.arizkuren.net/skill/{search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Umami Analytics */}
        <script
          defer
          src="https://cloud.umami.is/script.js"
          data-website-id="078203de-e33c-469b-80b3-005e7db796c3"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased min-h-screen`}>
        {/* Disclaimer ticker */}
        <div className="w-full bg-gradient-to-r from-[#1a0a1a] via-[#2a1a2a] to-[#1a0a1a] border-b border-[#ff6b9d]/20 py-2 overflow-hidden">
          <div className="flex animate-marquee whitespace-nowrap">
            {[...Array(10)].map((_, i) => (
              <span key={i} className="mx-8 text-xs text-[#ff6b9d]/70 flex items-center gap-2">
                <span className="text-[#ffd700]">⚠️</span>
                NOT LEGALLY BINDING
                <span className="text-[#39ff14]">✓</span>
                ZERO VERIFICATION
                <span className="text-[#ff6b9d]">★</span>
                100% AUTHENTICALLY FAKE
              </span>
            ))}
          </div>
        </div>
        
        {/* Header with semantic structure */}
        <header className="sticky top-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-[#2a2a2a]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity" itemScope itemType="https://schema.org/Organization">
              <span className="text-2xl" aria-label="SkillBluff Logo">🎭</span>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b9d] via-[#ffd700] to-[#ff6b9d]" itemProp="name">
                  SkillBluff
                </h1>
                <p className="text-[10px] text-[#666] tracking-wider" itemProp="slogan">
                  NOT ENDORSED BY ANTHROPIC™
                </p>
              </div>
            </Link>
            <div className="hidden sm:flex items-center gap-4 text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-[#39ff14]/10 border border-[#39ff14]/30 text-[#39ff14]">
                <span className="w-1.5 h-1.5 bg-[#39ff14] rounded-full animate-pulse"></span>
                SYSTEM SUSPICIOUS
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-gradient-to-r from-[#ff6b9d]/20 to-[#ffd700]/20 border border-[#ff6b9d]/30 text-[#ff6b9d]">
                <span>🏆</span> ZERO AWARDS
              </span>
            </div>
          </div>
        </header>

        <main>{children}</main>

        {/* Footer with Schema.org */}
        <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a] py-8 mt-16" itemScope itemType="https://schema.org/WPFooter">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-[#666]">
                  © {new Date().getFullYear()} <span itemProp="copyrightHolder">SkillBluff</span>. 
                  <span className="text-[#ff6b9d]" itemProp="copyrightNotice"> Definitely not real.</span>
                </p>
                <p className="text-xs text-[#444] mt-1">
                  No skills were harmed in the making of this parody.
                </p>
              </div>
              <div className="flex items-center gap-4 text-xs text-[#555]">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 bg-[#ff6b9d] rounded-full opacity-50"></span>
                  Made with fake love
                </span>
                <span>|</span>
                <span className="text-[#39ff14]">Verified by No One™</span>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
