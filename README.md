# 🌟 Portfolio — Serigne Saliou GNINGUE

Portfolio professionnel full-stack avec espace d'administration sécurisé.

---

## 🚀 Installation et démarrage

### Prérequis
- **Node.js** version 18 ou supérieure
- Télécharger sur : https://nodejs.org/

### Étapes

```bash
# 1. Ouvrir un terminal dans ce dossier
cd portfolio-app

# 2. Installer les dépendances
npm install

# 3. Démarrer le serveur
npm start
```

Le portfolio est ensuite accessible sur :
- **Portfolio public** : http://localhost:3000
- **Espace Admin**     : http://localhost:3000/admin

---

## 🔒 Connexion à l'espace Admin

| Champ       | Valeur                             |
|-------------|-----------------------------------|
| Téléphone   | `77 746 27 82` ou `76 181 15 74`  |
| Mot de passe | `Ssgningue15@yahoo.com`           |

> ℹ️ Le format du numéro est flexible : vous pouvez entrer `+221 77 746 27 82`, `77746 2782`, etc.

---

## 📂 Structure du projet

```
portfolio-app/
├── server.js              ← Serveur Express (backend)
├── package.json           ← Dépendances Node.js
├── portfolio.db           ← Base de données SQLite (créée automatiquement)
├── uploads/
│   ├── projects/          ← Images des projets uploadées
│   └── certificates/      ← Fichiers des certificats uploadés
└── public/
    ├── index.html         ← Portfolio public (frontend)
    └── admin/
        └── index.html     ← Espace d'administration
```

---

## ✨ Fonctionnalités

### Portfolio public
- Design dark mode premium avec gradient violet-bleu-rose
- Animation de particules dans le hero
- Effet de frappe (typing animation)
- Sections : Hero, À propos, Compétences, Projets, Formation, Certificats, Contact
- Formulaire de contact fonctionnel
- Toggle Dark / Light mode
- Responsive mobile-first
- Animations au scroll

### Espace Admin
- Connexion sécurisée (JWT, 30 jours)
- Tableau de bord avec statistiques en temps réel
- **Gestion des projets** : Créer, modifier, supprimer, upload d'image
- **Gestion des certificats** : Créer, modifier, supprimer, upload PDF/image
- **Boîte de réception** : Lire et répondre aux messages du formulaire de contact
- Changement de mot de passe
- Toggle Dark / Light mode

---

## 🔌 API disponible

| Méthode | Endpoint                    | Description                   |
|---------|----------------------------|-------------------------------|
| GET     | /api/projects              | Liste des projets (public)    |
| GET     | /api/certificates          | Liste des certificats (public)|
| POST    | /api/messages              | Envoyer un message de contact |
| POST    | /api/auth/login            | Connexion admin               |
| POST    | /api/projects              | Créer un projet (auth)        |
| PUT     | /api/projects/:id          | Modifier un projet (auth)     |
| DELETE  | /api/projects/:id          | Supprimer un projet (auth)    |
| POST    | /api/certificates          | Ajouter un certificat (auth)  |
| PUT     | /api/certificates/:id      | Modifier un certificat (auth) |
| DELETE  | /api/certificates/:id      | Supprimer un certificat (auth)|
| GET     | /api/messages              | Lire les messages (auth)      |
| GET     | /api/admin/stats           | Statistiques du tableau de bord|

---

## 🌐 Déploiement en ligne (optionnel)

Pour mettre le portfolio en ligne, vous pouvez utiliser :
- **Railway** : https://railway.app (gratuit)
- **Render**  : https://render.com (gratuit)

Ces plateformes supportent Node.js et SQLite nativement.

---

## 💡 Certificats déjà pré-chargés

| Certificat | Organisme | Catégorie |
|---|---|---|
| CS50's Introduction to Programming with Python | Harvard University | Génie Logiciel |
| Python Essentials 1 | Cisco Networking Academy | Génie Logiciel |
| HCIA-Datacom V1.0 | Huawei | Cybersécurité |
| CCNA: Introduction to Networks | Cisco Networking Academy | Cybersécurité |

> Vous pouvez uploader les fichiers PDF depuis l'espace Admin → Certifications → Modifier.

---

*Portfolio créé avec ❤️ — Serigne Saliou GNINGUE, ESP & UVS*
