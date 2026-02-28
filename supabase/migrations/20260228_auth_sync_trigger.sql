-- TRIGGER PER SINCRONIZZAZIONE AUTH -> PERSONALE
-- Questo script va eseguito nell'SQL Editor di Supabase

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.personale (id, nome, email, ruolo)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Nuovo Utente'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'role', 'cameriere')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Rimuovi se esiste già per evitare errori
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Attiva il trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
