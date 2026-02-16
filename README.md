# 🎭 Fake Skill Generator

Generador de skills falsas para Claude Code con un toque de humor. Crea skills absurdas pero creíbles que parodian el formato SKILL.md.

## Características

- 📝 Genera skills irónicas a partir de cualquier prompt
- 🔗 Comparte skills generadas con URL única
- 🌍 Soporte multiidioma (detección automática)
- ☁️ Persistencia segura en Supabase (acceso restringido al backend)
- 🔒 Sin exposición de credenciales al frontend

## Configuración

### 1. Variables de entorno (Backend only)

Copia `.env.local.example` a `.env.local` y configura:

```bash
# Supabase (solo backend, nunca expuesto al navegador)
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key

# Ollama (solo backend)
OLLAMA_API_URL=https://api.ollama.com
OLLAMA_API_KEY=tu-api-key
OLLAMA_MODEL=llama3.1
```

**Importante:** La `SUPABASE_SERVICE_ROLE_KEY` tiene privilegios completos y solo debe usarse en el backend. Nunca la expongas al frontend (no uses `NEXT_PUBLIC_`).

### 2. Base de datos Supabase

Ejecuta el SQL en `supabase/migrations/001_create_skills_table.sql` en el SQL Editor de Supabase para crear la tabla.

Con SERVICE ROLE KEY no es necesario habilitar RLS para operaciones backend, pero puedes añadirlo si quieres acceso anónimo limitado desde frontend.

### 3. Instalación

```bash
npm install
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Deploy en Vercel

1. Conecta tu repo a Vercel
2. Añade las variables de entorno en Vercel Dashboard → Settings → Environment Variables:
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OLLAMA_API_URL`
   - `OLLAMA_API_KEY`
3. Deploy automático en cada push

## Cómo funciona

1. Escribe lo que quieres que haga la skill (ej: "regar las plantas de mi casa")
2. El frontend envía el prompt a la API de Next.js (backend)
3. El backend genera el contenido con Ollama y lo guarda en Supabase
4. Se devuelve la skill generada al frontend
5. La página de la skill se renderiza server-side leyendo de Supabase

**Seguridad:** Todo el acceso a Supabase ocurre en el backend. El navegador nunca ve las credenciales de la base de datos.

## Tecnologías

- Next.js 16 + React 19 + TypeScript
- Tailwind CSS v4
- Supabase (PostgreSQL) - acceso solo desde backend
- Ollama (generación de texto)

---

*Parodia de las skills de Claude Code. No te tomes esto en serio.* 😄
