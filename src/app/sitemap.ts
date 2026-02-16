import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

// ISR: Cacheado 1h, revalidable on-demand
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://skillbluff.arizkuren.net";
  
  // URLs estáticas - siempre disponibles
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
  ];

  // Obtener skills de Supabase - usar credenciales del entorno actual
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.log("[Sitemap] Missing credentials, returning static only");
      return staticUrls;
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false },
    });

    const { data: skills, error } = await supabase
      .from("skills")
      .select("id, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[Sitemap] Supabase error:", error);
      return staticUrls;
    }

    console.log(`[Sitemap] Found ${skills?.length || 0} skills`);

    const skillUrls: MetadataRoute.Sitemap = skills?.map((skill) => ({
      url: `${baseUrl}/skill/${skill.id}`,
      lastModified: new Date(skill.updated_at || skill.created_at),
      changeFrequency: "never",
      priority: 0.7,
    })) || [];

    return [...staticUrls, ...skillUrls];
  } catch (error) {
    console.error("[Sitemap] Error:", error);
    return staticUrls;
  }
}