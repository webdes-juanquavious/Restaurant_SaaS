-- POLICY DI SICUREZZA AVANZATE (RLS)
-- Questo script garantisce che gli utenti autenticati possano lavorare sui dati

-- 1. PERSONALE: Solo gli admin vedono tutto, gli altri vedono solo se stessi
CREATE POLICY "Admin full access personale" ON personale FOR ALL TO authenticated USING (
  (SELECT (raw_user_metadata->>'role') FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- 2. TAVOLI: Tutti gli autenticati possono vedere e modificare (staff)
CREATE POLICY "Authenticated users can manage tavoli" ON tavoli FOR ALL TO authenticated USING (true);

-- 3. MENU: Admin può gestire tutto, pubblico solo leggere
CREATE POLICY "Admin manage menu" ON menu FOR ALL TO authenticated USING (
  (SELECT (raw_user_metadata->>'role') FROM auth.users WHERE id = auth.uid()) = 'admin'
);

-- 4. PRENOTAZIONI: Staff può gestire tutto
CREATE POLICY "Staff manage prenotazioni" ON prenotazioni FOR ALL TO authenticated USING (true);

-- 5. OFFERTE: Admin gestisce, pubblico legge
CREATE POLICY "Admin manage offerte" ON offerte FOR ALL TO authenticated USING (
  (SELECT (raw_user_metadata->>'role') FROM auth.users WHERE id = auth.uid()) = 'admin'
);
