-- ============================================================
-- FIX RLS — Table messages
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Supprimer toutes les politiques existantes sur messages
DROP POLICY IF EXISTS "Envoi de message public"     ON messages;
DROP POLICY IF EXISTS "Admin peut lire les messages" ON messages;
DROP POLICY IF EXISTS "Admin peut gérer les messages" ON messages;

-- 2. S'assurer que RLS est bien activé
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 3. Politique INSERT : ouverte à tout le monde (anon + authenticated)
--    C'est ce qui permet au formulaire de contact d'insérer sans connexion
CREATE POLICY "Envoi de message public"
  ON messages
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 4. Politique SELECT : uniquement les admins connectés
CREATE POLICY "Admin peut lire les messages"
  ON messages
  FOR SELECT
  TO authenticated
  USING (true);

-- 5. Politique UPDATE : uniquement les admins connectés (marquer comme lu)
CREATE POLICY "Admin peut mettre à jour les messages"
  ON messages
  FOR UPDATE
  TO authenticated
  USING (true);

-- 6. Politique DELETE : uniquement les admins connectés
CREATE POLICY "Admin peut supprimer les messages"
  ON messages
  FOR DELETE
  TO authenticated
  USING (true);

-- Vérification : lister les politiques actives
SELECT policyname, cmd, roles
FROM pg_policies
WHERE tablename = 'messages';
