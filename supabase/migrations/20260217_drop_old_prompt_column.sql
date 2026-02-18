-- Migration: Eliminar columna prompt antigua (ya migrada a original_prompt)
-- Created: 2026-02-17

ALTER TABLE skills DROP COLUMN IF EXISTS prompt;

COMMENT ON COLUMN skills.original_prompt IS 'El prompt original que escribió el usuario';
