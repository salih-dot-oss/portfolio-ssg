# Reprendre le projet après un reclone

Le dossier local `Desktop\Projets\portfolio\Moi\portfolio-app` a été supprimé le 2026-09-25 pour libérer de l'espace disque.
Tout le code et les fichiers locaux utiles ont été poussés sur GitHub avant la suppression.

## 1. Cloner

```bash
git clone https://github.com/salih-dot-oss/portfolio-ssg.git
cd portfolio-ssg
git fetch --all --tags
```

## 2. Branches

| Branche | Rôle |
|---------|------|
| `main` | Branche unique |

## 3. Fichiers normalement ignorés, sauvegardés dans le repo

`client/src/cv.css`, `client/src/pages/CVPage.jsx`, `client/src/pages/CVDevPage.jsx`, `data/certificates.json`, `uploads/` — ⚠️ ce repo est **public**, ces fichiers sont visibles par tous.

⚠️ **Non sauvegardés en ligne** (secrets) : `data/admins.json` (comptes admin) et `client/.env` → à recréer depuis `client/.env.example` (Supabase + clés EmailJS).

Non sauvegardés (se recréent) : `node_modules/` → `npm install` ; `dist/` → `npm run build`.

## 4. Installation

```bash
npm install
cd client && npm install && cd ..
npm run dev
```
Serveur : `server.js`. Supabase : `supabase/`.