-- Add 'sospeso' to personnel status check
ALTER TABLE personale DROP CONSTRAINT IF EXISTS personale_status_check;
ALTER TABLE personale ADD CONSTRAINT personale_status_check CHECK (status IN ('attivo', 'malattia', 'ferie', 'sospeso'));
