-- Fix RLS policies to use auth.jwt() instead of subqueries on auth.users
-- This is more reliable and doesn't require extra permissions on the auth schema.

-- 1. PERSONALE
DROP POLICY IF EXISTS "Admin full access personale" ON personale;
CREATE POLICY "Admin full access personale" ON personale FOR ALL TO authenticated USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 2. MENU (Update management policy)
DROP POLICY IF EXISTS "Admin manage menu" ON menu;
CREATE POLICY "Admin manage menu" ON menu FOR ALL TO authenticated USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 3. OFFERTE (Update management policy)
DROP POLICY IF EXISTS "Admin manage offerte" ON offerte;
CREATE POLICY "Admin manage offerte" ON offerte FOR ALL TO authenticated USING (
  (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);

-- 4. TAVOLI & PRENOTAZIONI (Check if they also need role check or if any authenticated is fine)
-- Keep as is if staff is allowed to manage them.
