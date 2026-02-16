import { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
);

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://skillbluff.arizkuren.net";
  
  // URLs estáticas
  const staticUrls: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

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
