-- ============================================================
-- PORTFOLIO SSG — Supabase Schema complet
-- À exécuter dans : Supabase Dashboard > SQL Editor
-- ============================================================

-- ============================================================
-- 1. EXTENSIONS
-- ============================================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- pour gen_salt / crypt
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";  -- pour uuid_generate_v4()


-- ============================================================
-- 2. TABLES
-- ============================================================

-- Projects
CREATE TABLE IF NOT EXISTS projects (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  description TEXT,
  tech        TEXT[]      DEFAULT '{}',
  github_url  TEXT,
  live_url    TEXT,
  image_url   TEXT,
  featured    BOOLEAN     DEFAULT false,
  published   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Certificates
CREATE TABLE IF NOT EXISTS certificates (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT        NOT NULL,
  issuer      TEXT        NOT NULL,
  issue_date  TEXT,
  category    TEXT        CHECK (category IN ('Génie Logiciel', 'Cybersécurité')),
  verify_url  TEXT,
  file_url    TEXT,
  published   BOOLEAN     DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Messages (formulaire de contact)
CREATE TABLE IF NOT EXISTS messages (
  id         BIGSERIAL PRIMARY KEY,
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  subject    TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  read       BOOLEAN     DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);


-- ============================================================
-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE projects      ENABLE ROW LEVEL SECURITY;
ALTER TABLE certificates  ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages      ENABLE ROW LEVEL SECURITY;

-- Projects : lecture publique des publiés seulement
DROP POLICY IF EXISTS "Lecture publique des projets publiés" ON projects;
CREATE POLICY "Lecture publique des projets publiés"
  ON projects FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

-- Projects : CRUD réservé aux admins
DROP POLICY IF EXISTS "Admin peut gérer les projets" ON projects;
CREATE POLICY "Admin peut gérer les projets"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

-- Certificates : lecture publique des publiés seulement
DROP POLICY IF EXISTS "Lecture publique des certificats publiés" ON certificates;
CREATE POLICY "Lecture publique des certificats publiés"
  ON certificates FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');

-- Certificates : CRUD réservé aux admins
DROP POLICY IF EXISTS "Admin peut gérer les certificats" ON certificates;
CREATE POLICY "Admin peut gérer les certificats"
  ON certificates FOR ALL
  USING (auth.role() = 'authenticated');

-- Messages : INSERT public (formulaire contact), SELECT/UPDATE/DELETE admin seulement
DROP POLICY IF EXISTS "Envoi de message public" ON messages;
CREATE POLICY "Envoi de message public"
  ON messages FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admin peut lire les messages" ON messages;
CREATE POLICY "Admin peut lire les messages"
  ON messages FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Admin peut gérer les messages" ON messages;
CREATE POLICY "Admin peut gérer les messages"
  ON messages FOR ALL
  USING (auth.role() = 'authenticated');


-- ============================================================
-- 4. STORAGE BUCKETS
-- ============================================================
-- À faire depuis le Dashboard Supabase : Storage > New bucket
-- Ou via API (non disponible en SQL pur).
--
-- Bucket "projects"     : Public = true
-- Bucket "certificates" : Public = true
--
-- Policies pour chaque bucket :
--   SELECT : pour tous (anon + authenticated)
--   INSERT / UPDATE / DELETE : authenticated seulement


-- ============================================================
-- 5. COMPTES ADMIN (Auth)
-- ============================================================
-- ATTENTION : remplace les mots de passe si nécessaire.
-- Les numéros sont convertis en faux emails : {9chiffres}@ssg.admin

-- Supprime les anciens comptes si besoin
-- DELETE FROM auth.identities WHERE user_id IN (SELECT id FROM auth.users WHERE email LIKE '%@ssg.admin');
-- DELETE FROM auth.users WHERE email LIKE '%@ssg.admin';

-- Admin 1 : 777462782 / Ssgningue15@yahoo.com
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token
)
VALUES (
  uuid_generate_v4(), 'authenticated', 'authenticated',
  '777462782@ssg.admin',
  crypt('Ssgningue15@yahoo.com', gen_salt('bf', 10)),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{}', false, ''
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  u.id,
  json_build_object('sub', u.id::text, 'email', u.email),
  'email', u.id::text,
  now(), now(), now()
FROM auth.users u
WHERE u.email = '777462782@ssg.admin'
ON CONFLICT DO NOTHING;

-- Admin 2 : 761811574 / (même mot de passe ou à changer)
INSERT INTO auth.users (
  id, aud, role, email, encrypted_password,
  email_confirmed_at, created_at, updated_at,
  raw_app_meta_data, raw_user_meta_data, is_super_admin, confirmation_token
)
VALUES (
  uuid_generate_v4(), 'authenticated', 'authenticated',
  '761811574@ssg.admin',
  crypt('Ssgningue15@yahoo.com', gen_salt('bf', 10)),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{}', false, ''
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id, last_sign_in_at, created_at, updated_at
)
SELECT
  uuid_generate_v4(),
  u.id,
  json_build_object('sub', u.id::text, 'email', u.email),
  'email', u.id::text,
  now(), now(), now()
FROM auth.users u
WHERE u.email = '761811574@ssg.admin'
ON CONFLICT DO NOTHING;


-- ============================================================
-- 6. DONNÉES INITIALES (optionnel)
-- ============================================================
-- Décommente et adapte pour insérer des données de départ.

/*
INSERT INTO certificates (name, issuer, issue_date, category, published) VALUES
  ('CS50''s Introduction to Programming with Python', 'Harvard University', '2024', 'Génie Logiciel', true),
  ('Python Essentials 1', 'Cisco Networking Academy', '2024', 'Génie Logiciel', true),
  ('HCIA-Datacom V1.0', 'Huawei', '2024', 'Cybersécurité', true),
  ('CCNA: Introduction to Networks', 'Cisco Networking Academy', '2024', 'Cybersécurité', true);
*/
