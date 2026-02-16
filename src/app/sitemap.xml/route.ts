import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Forzar Node.js runtime (no Edge) para acceso completo a env vars
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  const baseUrl = "https://skillbluff.arizkuren.net";
  
  // DEBUG: Ver todas las variables disponibles
  console.log('[Sitemap] All env keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
  
  // Fecha actual en formato ISO
  const now = new Date().toISOString();
  
  // URLs estáticas
  let urls = [
    {
      loc: baseUrl,
      lastmod: now,
      changefreq: "daily",
      priority: "1.0",
    },
  ];

  // Obtener skills de Supabase
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;
    
    console.log('[Sitemap] URL exists:', !!supabaseUrl, 'Key exists:', !!supabaseKey);
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey, {
        auth: { persistSession: false },
      });

      const { data: skills, error } = await supabase
        .from("skills")
        .select("id, created_at")
        .order("created_at", { ascending: false });

      if (!error && skills && skills.length > 0) {
        const skillUrls = skills.map((skill) => ({
          loc: `${baseUrl}/skill/${skill.id}`,
          lastmod: new Date(skill.created_at).toISOString(),
          changefreq: "never",
          priority: "0.7",
        }));
        
        urls = [...urls, ...skillUrls];
        console.log(`[Sitemap] Generated with ${urls.length} URLs (${skillUrls.length} skills)`);
      } else {
        console.log("[Sitemap] No skills found or error:", error);
      }
    } else {
      console.log("[Sitemap] Missing Supabase credentials");
    }
  } catch (error) {
    console.error("[Sitemap] Error fetching skills:", error);
  }

  // Generar XML
  const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls
    .map(
      (url) => `
  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`
    )
    .join("")}
</urlset>`;

  return new NextResponse(sitemapXML, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

// Escapar caracteres especiales en URLs
function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
