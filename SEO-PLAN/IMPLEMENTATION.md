# 📋 PLAN DE IMPLEMENTACIÓN SEO/GEO - SKILLBLUFF

## 🎯 RESUMEN EJECUTIVO

SkillBluff tiene un potencial SEO inmenso por el contenido generado por usuarios (skills falsas), pero actualmente es **INVISIBLE** para motores de búsqueda e IA. Este plan prioriza las acciones por impacto y facilidad de implementación.

---

## 🚨 PRIORIDAD 1: CRÍTICO (Esta semana)

### 1.1 Metadata Global (layout.tsx)
**Estado:** ❌ No implementado  
**Impacto:** Alto | **Esfuerzo:** Bajo

**Acciones:**
- [ ] Reemplazar layout.tsx con la versión SEO optimizada (`layout-seo.tsx.new`)
- [ ] Verificar lang="en" (contenido está en inglés)
- [ ] Añadir JSON-LD Schema.org Website
- [ ] Configurar Open Graph y Twitter Cards

**Fichero:** `src/app/layout.tsx` → usar `layout-seo.tsx.new`

### 1.2 Metadata Dinámico por Skill  
**Estado:** ❌ No implementado  
**Impacto:** CRÍTICO | **Esfuerzo:** Medio

**Acciones:**
- [ ] Implementar `generateMetadata()` en `src/app/skill/[id]/page.tsx`
- [ ] Usar el snippet de `SEO-PLAN/metadata-skill.ts`
- [ ] Extraer datos de Supabase para título/descripción dinámica
- [ ] Añadir Schema.org CreativeWork por skill

**Ejemplo de resultado:**
```
Título: "Water Plants While in Denial - Fake Skill | SkillBluff"
Descripción: "A 300-word fake skill for Claude Code watering plants..."
```

### 1.3 Sitemap XML Dinámico
**Estado:** ❌ No existe  
**Impacto:** CRÍTICO | **Esfuerzo:** Medio

**Acciones:**
- [ ] Crear endpoint `/app/sitemap.ts` (ya creado en SEO-PLAN)
- [ ] Implementar `getAllSkills()` en Supabase para listar todas
- [ ] Configurar `changeFrequency: "never"` (skills no cambian)
- [ ] Prioridad 0.7 para skills, 1.0 para home

**Query Supabase necesaria:**
```typescript
const { data } = await supabase
  .from('skills')
  .select('id, created_at')
  .order('created_at', { ascending: false });
```

### 1.4 Robots.txt
**Estado:** ❌ No existe  
**Impacto:** Alto | **Esfuerzo:** Bajo

**Acciones:**
- [ ] Copiar archivo a `public/robots.txt` (ya creado)
- [ ] Verificar sitemap URL apunta a producción
- [ ] Permitir bots de IA (ChatGPT-User, Claude-Web, PerplexityBot)

---

## 📊 PRIORIDAD 2: IMPORTANTE (Semana 2-3)

### 2.1 PWA / Manifest.json
**Estado:** ❌ No existe  
**Impacto:** Medio | **Esfuerzo:** Medio

**Acciones:**
- [ ] Copiar `public/manifest.json` (ya creado)
- [ ] Crear iconos PWA (72x72, 192x192, 512x512)
- [ ] Añadir screenshots para install prompt
- [ ] Crear service worker básico para offline

### 2.2 Open Graph Images Dinámicas
**Estado:** ❌ Solo placeholder  
**Impacto:** Alto | **Esfuerzo:** Alto

**Acciones:**
- [ ] Crear imagen OG estática `/public/og-image.png` (1200x630)
- [ ] Opcional: Implementar OG dinámico con Vercel OG Image Generation
- [ ] Incluir branding, título y preview de skill

**Ejemplo OG Image:**
- Fondo oscuro con gradiente rosa/dorado
- Logo 🎭 SkillBluff
- Título de la skill
- Badge "FAKE SKILL"
- URL corta

### 2.3 Schema.org Avanzado
**Estado:** ❌ Básico  
**Impacto:** Alto para GEO | **Esfuerzo:** Medio

**Estructuras a implementar:**

**BlogPosting** para cada skill (contenido generado):
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Skill Name",
  "description": "Fake skill for Claude Code",
  "author": {"@type": "Organization", "name": "SkillBluff"},
  "publisher": {"@type": "Organization", "name": "SkillBluff"},
  "datePublished": "2026-02-16",
  "articleBody": "...markdown content...",
  "keywords": ["fake skill", "claude code"]
}
```

**SoftwareApplication** (para el generador):
```json
{
  "@type": "SoftwareApplication",
  "name": "SkillBluff",
  "applicationCategory": "EntertainmentApplication",
  "offers": {"@type": "Offer", "price": "0"}
}
```

### 2.4 URLs Amigables (Slug-based)
**Estado:** ⚠️ IDs aleatorios  
**Impacto:** Medio | **Esfuerzo:** Alto

**Problema actual:** `/skill/montar-armario-ikea-cf33om`
**Mejora propuesta:** `/skill/montar-armario-ikea` + canonical con ID

**Acciones:**
- [ ] Implementar slugs basados en nombre
- [ ] Redirigir 301 desde URLs antiguas
- [ ] Añadir campo `slug` a la tabla de Supabase

---

## 🤖 PRIORIDAD 3: GEO (Generative Engine Optimization)

Este es el **futuro del SEO** - optimizar para que ChatGPT, Claude, Gemini, Perplexity citen tu contenido.

### 3.1 Contenido Estructurado para IA
**Estado:** ❌ Desestructurado  
**Impacto:** CRÍTICO para GEO | **Esfuerzo:** Medio

**Acciones:**
- [ ] Añadir encabezados claros (H1, H2, H3)
- [ ] FAQ Section con Schema.org en cada skill:
```html
<div itemscope itemtype="https://schema.org/FAQPage">
  <div itemscope itemprop="mainEntity" itemtype="https://schema.org/Question">
    <h3 itemprop="name">¿Qué es esta skill?</h3>
    <div itemscope itemprop="acceptedAnswer" itemtype="https://schema.org/Answer">
      <p itemprop="text">Es una skill falsa para Claude Code...</p>
    </div>
  </div>
</div>
```

### 3.2 Knowledge Graph Entities
**Estado:** ❌ No implementado  
**Impacto:** Alto para GEO | **Esfuerzo:** Alto

**Acciones:**
- [ ] Definir entidades: "Claude Code", "MCP", "AI Skills"
- [ ] Enlazar a definiciones de Wikipedia/Schema.org
- [ ] Usar `sameAs` para entidades conocidas

### 3.3 Contenido para "Cita Directa"
**Estado:** ❌ No optimizado  
**Impacto:** Alto | **Esfuerzo:** Bajo

**Estrategia:**
- Añadir sección "TL;DR" o "Resumen" de 2-3 frases al inicio de cada skill
- Las IA prefieren citar contenido conciso
- Formato: <blockquote> con atributos semánticos

---

## 📈 PRIORIDAD 4: Growth & Analytics

### 4.1 Google Search Console
**Acciones:**
- [ ] Añadir dominio a GSC
- [ ] Verificar propiedad (añadir "google" al metadata.verification)
- [ ] Enviar sitemap
- [ ] Configurar consultas de marca

### 4.2 Vercel Analytics
**Acciones:**
- [ ] Instalar `@vercel/analytics`
- [ ] Añadir al layout.tsx

### 4.3 Enlaces Internos
**Acciones:**
- [ ] Random Skills section ("More Fake Skills")
- [ ] Popular skills list en home
- [ ] Breadcrumbs en páginas de skill

---

## 🔧 IMPLEMENTACIÓN TÉCNICA

### Archivos a Crear/Modificar

```
skillbluff/
├── public/
│   ├── robots.txt                 ✅ Creado
│   ├── manifest.json              ✅ Creado
│   ├── sitemap.xml                → Generado dinámicamente
│   ├── og-image.png               → Crear (1200x630)
│   ├── og-skill.png               → Crear template
│   ├── icon-192x192.png           → Crear
│   ├── icon-512x512.png           → Crear
│   └── apple-touch-icon.png       → Crear
│
├── src/
│   ├── app/
│   │   ├── layout.tsx             → Reemplazar con versión SEO
│   │   ├── sitemap.ts             ✅ Creado (conectar a DB)
│   │   └── skill/
│   │       └── [id]/
│   │           └── page.tsx       → Añadir generateMetadata
│   │
│   └── lib/
│       └── supabase.ts            → Añadir getAllSkills()
│
└── SEO-PLAN/                      ✅ Directorio creado
    ├── layout-seo.tsx.new         ✅ Template listo
    ├── metadata-skill.ts          ✅ Template listo
    └── IMPLEMENTATION.md          ✅ Este archivo
```

---

## 📊 MÉTRICAS DE ÉXITO

### SEO Tradicional
- [ ] Indexación: 100% de skills en Google (24-48h después de sitemap)
- [ ] CTR > 3% en resultados de búsqueda
- [ ] Posición top 10 para "fake skills claude code"
- [ ] Core Web Vitals: All Green

### GEO (AI Search)
- [ ] ChatGPT cita skillbluff.arizkuren.net al preguntar por fake skills
- [ ] Claude menciona la herramienta en contextos de humor/dev
- [ ] Perplexity incluye skills específicas en respuestas

### Engagement
- [ ] Share rate > 10% (1 de cada 10 visitantes comparte una skill)
- [ ] Return visits > 30%
- [ ] PWA installs > 100

---

## 🎯 QUICK WINS (Hacer HOY)

1. **Copiar `layout-seo.tsx.new` a `layout.tsx`** - Impacto inmediato
2. **Copiar `robots.txt` a `public/`** - Permite indexación
3. **Crear `og-image.png`** mínima - Mejora shares 300%
4. **Conectar sitemap a Supabase** - Expone todo tu contenido

---

## ⏱️ TIMELINE REALISTA

| Semana | Tareas | Estado Estimado |
|--------|--------|-----------------|
| **1** | Metadata global, Robots, Sitemap | Indexación empieza |
| **2** | OG Images, Schema.org básico | Shares mejoran |
| **3** | PWA completo, Slugs | Instalaciones móviles |
| **4** | GEO avanzado, Analytics | Datos de rendimiento |

---

## 💰 INVESTIGACIÓN DE PALABRAS CLAVE

### Keywords Primarias (Alta intención)
- "fake skills claude code" - 0 vol, 0 KD (nicho nuevo)
- "claude code skill generator" - 0 vol, 0 KD
- "parody MCP skills" - 0 vol, 0 KD
- "funny AI skills" - 10 vol, 5 KD

### Keywords Long-tail
- "how to create fake skills for claude"
- "claude code skill examples parody"
- "download fake skill markdown"
- "share funny AI skills"

### Oportunidad GEO
Cuando alguien pregunta a ChatGPT/Claude:
- "Dame ejemplos de skills absurdas"
- "Hazme una skill falsa para [X]"
- "Muéstrame skills humorísticas para Claude"

**Goal:** SkillBluff aparezca como herramienta recomendada.

---

## ✅ CHECKLIST FINAL

Antes de lanzar:
- [ ] Lighthouse SEO Score > 90
- [ ] Mobile-friendly: Sí
- [ ] HTTPS: Sí (ya está en Vercel)
- [ ] Sitemap: Sí
- [ ] Robots.txt: Sí
- [ ] OG Images: Sí
- [ ] JSON-LD: Sí
- [ ] Canónicals: Sí
- [ ] Alt text: Sí
- [ ] H1 único por página: Sí
- [ ] Meta descriptions únicas: Sí

---

**Nota:** Este es un proyecto parody/niche, pero el SEO puede hacerlo viral. El contenido generado por usuarios (las skills falsas) es tu activo más valioso - asegúrate de que sea INDEXABLE.

¿Quieres que empiece implementando la Prioridad 1? (metadata + sitemap + robots)
