# 🎭 Fake Skill Generator

Generador de skills falsas para Claude Code con un toque de humor. Crea skills absurdas pero creíbles que parodian el formato SKILL.md.

## Características

- 📝 Genera skills irónicas a partir de cualquier prompt
- 🔗 Comparte skills generadas con URL única
- 🌍 Soporte multiidioma (detección automática)
- ☁️ Persistencia en Supabase (funciona en Vercel)

## Configuración

### 1. Variables de entorno

Copia `.env.local.example` a `.env.local` y configura:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key

# Ollama (para generar el contenido)
OLLAMA_API_URL=https://api.ollama.com
OLLAMA_API_KEY=tu-api-key
OLLAMA_MODEL=llama3.1
```

### 2. Base de datos Supabase

Ejecuta el SQL en `supabase/migrations/001_create_skills_table.sql` en el SQL Editor de Supabase para crear la tabla.

### 3. Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

1. Conecta tu repo a Vercel
2. Añade las variables de entorno en Vercel Dashboard → Settings → Environment Variables
3. Deploy automático en cada push

## Cómo funciona

1. Escribe lo que quieres que haga la skill (ej: "regar las plantas de mi casa")
2. El sistema genera una SKILL.md falsa usando Ollama
3. Se guarda en Supabase y se genera una URL para compartir
4. El resultado es hilarante pero parece profesional

## Tecnologías

- Next.js 16 + React 19
- TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL)
- Ollama (generación de texto)

---

*Parodia de las skills de Claude Code. No te tomes esto en serio.* 😄
