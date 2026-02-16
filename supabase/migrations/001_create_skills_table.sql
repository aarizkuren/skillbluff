-- Crear tabla de skills en Supabase
-- Ejecutar esto en el SQL Editor de Supabase

CREATE TABLE IF NOT EXISTS skills (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  prompt TEXT NOT NULL,
  content TEXT NOT NULL,
  language TEXT NOT NULL,
  word_count INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índice para búsquedas por nombre
CREATE INDEX IF NOT EXISTS idx_skills_name ON skills(name);

-- Nota: Con SECRET KEY no es necesario RLS para operaciones backend
-- La SECRET KEY tiene privilegios completos y bypass RLS
-- (Reemplaza al antiguo SERVICE ROLE KEY que está deprecated)
-- Si quieres permitir acceso anónimo limitado desde frontend, habilita RLS:

-- ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- -- Permitir lectura pública (solo si necesitas acceso desde frontend)
-- CREATE POLICY "Allow public read access" ON skills
--   FOR SELECT USING (true);
