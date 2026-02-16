import { MetadataRoute } from "next";

// ISR: Cacheado 1h, revalidable on-demand via revalidatePath('/sitemap.xml')
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

  // Solo obtener skills si tenemos credenciales (runtime, no build)
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    // Durante build sin credenciales, devolver solo URLs estáticas
    console.log("Sitemap: No Supabase credentials, returning static URLs only");
    return staticUrls;
  }

  // Crear cliente solo cuando sea necesario
  const { createClient } = await import("@supabase/supabase-js");
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: { persistSession: false },
  });

  // Obtener todas las skills de Supabase
  try {
    const { data: skills, error } = await supabase
      .from("skills")
      .select("id, created_at, updated_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching skills for sitemap:", error);
      return staticUrls;
    }

    const skillUrls: MetadataRoute.Sitemap = skills?.map((skill) => ({
      url: `${baseUrl}/skill/${skill.id}`,
      lastModified: new Date(skill.updated_at || skill.created_at),
      changeFrequency: "never",
      priority: 0.7,
    })) || [];

    return [...staticUrls, ...skillUrls];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticUrls;
  }
}
