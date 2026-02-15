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

-- Habilitar RLS (Row Level Security) - opcional pero recomendado
ALTER TABLE skills ENABLE ROW LEVEL SECURITY;

-- Política para permitir lectura pública
CREATE POLICY "Allow public read access" ON skills
  FOR SELECT USING (true);

-- Política para permitir inserción pública (para el generador)
CREATE POLICY "Allow public insert" ON skills
  FOR INSERT WITH CHECK (true);
