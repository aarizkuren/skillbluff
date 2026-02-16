// METADATA DINÁMICO PARA PÁGINAS DE SKILL
// Añadir a: src/app/skill/[id]/page.tsx

import type { Metadata } from "next";

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const { id } = params;
  const skill = await getSkillById(id);
  
  if (!skill) {
    return {
      title: "Skill Not Found | SkillBluff",
      description: "This fake skill doesn't exist (surprising, we know).",
      robots: { index: false, follow: true },
    };
  }
  
  // Título optimizado: Nombre de skill + branding
  const title = `${skill.displayName} - Fake Skill for Claude Code | SkillBluff`;
  
  // Descripción con keywords y CTA
  const description = `View the fake skill "${skill.displayName}" - A hilarious ${skill.language} skill markdown for Claude Code. Generate your own fake AI skills at SkillBluff.`;
  
  // URL canónica de la skill
  const url = `https://skillbluff.arizkuren.net/skill/${id}`;
  
  return {
    title,
    description,
    
    // Canonical específico
    alternates: {
      canonical: url,
    },
    
    // Robots: indexar skills (son contenido generado por usuarios, pero valioso)
    robots: {
      index: true,
      follow: true,
      nocache: false,
    },
    
    // Open Graph optimizado para compartir skills
    openGraph: {
      type: "article",
      locale: skill.language === "es" ? "es_ES" : "en_US",
      url,
      siteName: "SkillBluff",
      title: `${skill.displayName} | Fake Skill for Claude Code`,
      description: `A ${skill.wordCount}-word fake skill for Claude Code. ${skill.prompt.slice(0, 100)}...`,
      images: [
        {
          url: "/og-skill.png", // TODO: Crear imagen dinámica OG
          width: 1200,
          height: 630,
          alt: `${skill.displayName} - Fake Skill`,
        },
      ],
      publishedTime: skill.createdAt,
      authors: ["SkillBluff"],
    },
    
    // Twitter Cards
    twitter: {
      card: "summary_large_image",
      site: "@skillbluff",
      title: `${skill.displayName} | Fake Skill`,
      description: `A ${skill.wordCount}-word fake skill for Claude Code.`,
      images: ["/og-skill.png"],
    },
    
    // Keywords específicos
    keywords: [
      skill.name,
      "fake skill",
      "claude code skill",
      "MCP skill",
      "AI skill parody",
      `${skill.language} skill`,
    ],
  };
}

// JSON-LD Schema.org para Skill (añadir al return del componente)
/*
<script
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "CreativeWork",
      name: skill.displayName,
      description: skill.description,
      url: `https://skillbluff.arizkuren.net/skill/${skill.id}`,
      author: {
        "@type": "Organization",
        name: "SkillBluff",
      },
      datePublished: skill.createdAt,
      inLanguage: skill.language,
      keywords: skill.prompt,
      text: skill.content,
      isPartOf: {
        "@type": "WebSite",
        name: "SkillBluff",
        url: "https://skillbluff.arizkuren.net",
      },
    }),
  }}
/>
*/
