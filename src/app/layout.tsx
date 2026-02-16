import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SkillBluff - Certifiably Fake Skills™",
  description: "The world's premier collection of completely fabricated, utterly unverified, and suspiciously unofficial skills for Claude Code. 100% fake, 200% fun.",
  keywords: ["fake skills", "claude code parody", "ai humor", "skillbluff"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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
        
        {/* Header */}
        <header className="sticky top-0 z-50 bg-[#0f0f0f]/80 backdrop-blur-xl border-b border-[#2a2a2a]">
          <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎭</span>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#ff6b9d] via-[#ffd700] to-[#ff6b9d]">SkillBluff</h1>
                <p className="text-[10px] text-[#666] tracking-wider">NOT ENDORSED BY ANTHROPIC™</p>
              </div>
            </div>
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

        {children}

        {/* Footer */}
        <footer className="border-t border-[#2a2a2a] bg-[#0a0a0a] py-8 mt-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-center md:text-left">
                <p className="text-sm text-[#666]">
                  © {new Date().getFullYear()} SkillBluff. 
                  <span className="text-[#ff6b9d]"> Definitely not real.</span>
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
