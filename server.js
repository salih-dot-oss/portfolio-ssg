/**
 * ============================================================
 *  PORTFOLIO SSG — Backend Express.js
 *  Serigne Saliou GNINGUE
 *  Base de données : JSON pur JavaScript (aucune compilation)
 * ============================================================
 */

const express = require('express');
const multer  = require('multer');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');
const path    = require('path');
const fs      = require('fs');

const app        = express();
const PORT       = process.env.PORT || 3000;
const JWT_SECRET = 'ssg_portfolio_jwt_secret_2024_esp_uvs';

// ─── Middleware ────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Création des dossiers nécessaires ────────────────────
const DIRS = ['uploads', 'uploads/projects', 'uploads/certificates', 'data'];
DIRS.forEach(dir => {
  const p = path.join(__dirname, dir);
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
});

// ═══════════════════════════════════════════════════════════
//  BASE DE DONNÉES JSON (zéro dépendance native)
// ═══════════════════════════════════════════════════════════

const DATA_DIR = path.join(__dirname, 'data');

function dbRead(name) {
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); }
  catch  { return []; }
}

function dbWrite(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`);
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
}

function dbNextId(name) {
  const items = dbRead(name);
  return items.length === 0 ? 1 : Math.max(...items.map(i => i.id)) + 1;
}

function dbInsert(name, data) {
  const items  = dbRead(name);
  const record = { id: dbNextId(name), ...data, created_at: new Date().toISOString() };
  items.push(record);
  dbWrite(name, items);
  return record;
}

function dbUpdate(name, id, data) {
  const items = dbRead(name);
  const idx   = items.findIndex(i => i.id === parseInt(id));
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...data };
  dbWrite(name, items);
  return items[idx];
}

function dbDelete(name, id) {
  const items    = dbRead(name);
  const filtered = items.filter(i => i.id !== parseInt(id));
  dbWrite(name, filtered);
  return filtered.length < items.length;
}

function dbFindById(name, id) {
  return dbRead(name).find(i => i.id === parseInt(id)) || null;
}

// ─── Initialisation Admin ─────────────────────────────────
if (dbRead('admins').length === 0) {
  const hash = bcrypt.hashSync('Ssgningue15@yahoo.com', 12);
  ['777462782', '761811574'].forEach(phone => {
    dbInsert('admins', { phone, password_hash: hash, name: 'Serigne Saliou' });
  });
  console.log('✅ Comptes admin créés.');
}

// ─── Initialisation Certificats par défaut ────────────────
if (dbRead('certificates').length === 0) {
  const defaultCerts = [
    { name: "CS50's Introduction to Programming with Python", issuer: 'Harvard University',       issue_date: '2024', category: 'Génie Logiciel',  verify_url: 'https://cs50.harvard.edu/python/', file_url: null },
    { name: 'Python Essentials 1',                            issuer: 'Cisco Networking Academy', issue_date: '2024', category: 'Génie Logiciel',  verify_url: 'https://www.netacad.com/',          file_url: null },
    { name: 'HCIA-Datacom V1.0',                             issuer: 'Huawei',                   issue_date: '2024', category: 'Cybersécurité',   verify_url: 'https://e.huawei.com/',             file_url: null },
    { name: 'CCNA: Introduction to Networks',                 issuer: 'Cisco Networking Academy', issue_date: '2024', category: 'Cybersécurité',   verify_url: 'https://www.netacad.com/',          file_url: null },
  ];
  defaultCerts.forEach(c => dbInsert('certificates', c));
  console.log('✅ Certificats par défaut insérés.');
}

// ─── Multer — Upload de fichiers ──────────────────────────
function makeStorage(folder) {
  return multer.diskStorage({
    destination: (req, file, cb) => cb(null, path.join(__dirname, `uploads/${folder}`)),
    filename:    (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `${Date.now()}_${Math.random().toString(36).substr(2, 8)}${ext}`);
    }
  });
}

const uploadProject = multer({
  storage: makeStorage('projects'),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Seules les images sont acceptées (JPG, PNG, WebP)'));
  }
});

const uploadCert = multer({
  storage: makeStorage('certificates'),
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];
    if (ok.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Format non supporté (JPG, PNG, PDF acceptés)'));
  }
});

// ─── Auth Middleware ──────────────────────────────────────
function auth(req, res, next) {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Non autorisé — token manquant' });
  try   { req.user = jwt.verify(token, JWT_SECRET); next(); }
  catch { res.status(401).json({ error: 'Token expiré ou invalide' }); }
}

// ─── Normalisation numéro de téléphone ────────────────────
function normalizePhone(raw = '') {
  return raw.replace(/\D/g, '').slice(-9); // 9 derniers chiffres
}

// ═══════════════════════════════════════════════════════════
//  API ROUTES
// ═══════════════════════════════════════════════════════════

// ── Auth ──────────────────────────────────────────────────
app.post('/api/auth/login', (req, res) => {
  const { phone, password } = req.body || {};
  if (!phone || !password) return res.status(400).json({ error: 'Téléphone et mot de passe requis' });

  const inputPhone = normalizePhone(phone);
  const matched    = dbRead('admins').find(a => normalizePhone(a.phone) === inputPhone && bcrypt.compareSync(password, a.password_hash));

  if (!matched) return res.status(401).json({ error: 'Numéro ou mot de passe incorrect' });

  const token = jwt.sign({ id: matched.id, phone: matched.phone, name: matched.name }, JWT_SECRET, { expiresIn: '30d' });
  res.json({ token, name: matched.name, message: 'Connexion réussie !' });
});

app.get('/api/auth/verify', auth, (req, res) => {
  res.json({ valid: true, user: req.user });
});

app.put('/api/auth/password', auth, (req, res) => {
  const { currentPassword, newPassword } = req.body || {};
  const admin = dbFindById('admins', req.user.id);
  if (!admin) return res.status(404).json({ error: 'Admin introuvable' });
  if (!bcrypt.compareSync(currentPassword, admin.password_hash)) return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
  if (!newPassword || newPassword.length < 6) return res.status(400).json({ error: 'Le nouveau mot de passe doit faire au moins 6 caractères' });
  dbUpdate('admins', req.user.id, { password_hash: bcrypt.hashSync(newPassword, 12) });
  res.json({ message: 'Mot de passe mis à jour' });
});

// ── Stats ─────────────────────────────────────────────────
app.get('/api/admin/stats', auth, (req, res) => {
  const msgs = dbRead('messages');
  res.json({
    projects:     dbRead('projects').length,
    certificates: dbRead('certificates').length,
    messages:     msgs.length,
    unread:       msgs.filter(m => !m.is_read).length,
  });
});

// ── Projets ───────────────────────────────────────────────
app.get('/api/projects', (req, res) => {
  const all = dbRead('projects').sort((a, b) => (b.featured || 0) - (a.featured || 0) || (a.order_num || 0) - (b.order_num || 0) || new Date(b.created_at) - new Date(a.created_at));
  res.json(all);
});

app.post('/api/projects', auth, uploadProject.single('image'), (req, res) => {
  const { title, description, technologies, github_url, live_url, featured, order_num } = req.body;
  if (!title) return res.status(400).json({ error: 'Le titre est obligatoire' });
  const image_url = req.file ? `/uploads/projects/${req.file.filename}` : null;
  const record = dbInsert('projects', {
    title, description: description || '', technologies: technologies || '',
    github_url: github_url || '', live_url: live_url || '', image_url,
    featured: featured === '1' || featured === true ? 1 : 0,
    order_num: parseInt(order_num) || 0,
  });
  res.json({ id: record.id, message: 'Projet créé avec succès' });
});

app.put('/api/projects/:id', auth, uploadProject.single('image'), (req, res) => {
  const current = dbFindById('projects', req.params.id);
  if (!current) return res.status(404).json({ error: 'Projet introuvable' });
  const { title, description, technologies, github_url, live_url, featured, order_num } = req.body;
  const image_url = req.file ? `/uploads/projects/${req.file.filename}` : current.image_url;
  dbUpdate('projects', req.params.id, {
    title:        title        || current.title,
    description:  description  !== undefined ? description  : current.description,
    technologies: technologies !== undefined ? technologies : current.technologies,
    github_url:   github_url   !== undefined ? github_url   : current.github_url,
    live_url:     live_url     !== undefined ? live_url     : current.live_url,
    image_url,
    featured:     featured !== undefined ? (featured === '1' || featured === true ? 1 : 0) : current.featured,
    order_num:    order_num !== undefined ? parseInt(order_num) : current.order_num,
  });
  res.json({ message: 'Projet mis à jour' });
});

app.delete('/api/projects/:id', auth, (req, res) => {
  const p = dbFindById('projects', req.params.id);
  if (!p) return res.status(404).json({ error: 'Projet introuvable' });
  if (p.image_url) {
    const fp = path.join(__dirname, p.image_url);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  dbDelete('projects', req.params.id);
  res.json({ message: 'Projet supprimé' });
});

// ── Certificats ───────────────────────────────────────────
app.get('/api/certificates', (req, res) => {
  const all = dbRead('certificates').sort((a, b) => a.category.localeCompare(b.category) || new Date(b.created_at) - new Date(a.created_at));
  res.json(all);
});

app.post('/api/certificates', auth, uploadCert.single('file'), (req, res) => {
  const { name, issuer, issue_date, category, verify_url } = req.body;
  if (!name || !issuer) return res.status(400).json({ error: 'Nom et organisme requis' });
  const file_url = req.file ? `/uploads/certificates/${req.file.filename}` : null;
  const record   = dbInsert('certificates', {
    name, issuer, issue_date: issue_date || '', category: category || 'Génie Logiciel',
    verify_url: verify_url || '', file_url,
  });
  res.json({ id: record.id, message: 'Certificat ajouté avec succès' });
});

app.put('/api/certificates/:id', auth, uploadCert.single('file'), (req, res) => {
  const current = dbFindById('certificates', req.params.id);
  if (!current) return res.status(404).json({ error: 'Certificat introuvable' });
  const { name, issuer, issue_date, category, verify_url } = req.body;
  const file_url = req.file ? `/uploads/certificates/${req.file.filename}` : current.file_url;
  dbUpdate('certificates', req.params.id, {
    name:       name       || current.name,
    issuer:     issuer     || current.issuer,
    issue_date: issue_date !== undefined ? issue_date : current.issue_date,
    category:   category   || current.category,
    verify_url: verify_url !== undefined ? verify_url : current.verify_url,
    file_url,
  });
  res.json({ message: 'Certificat mis à jour' });
});

app.delete('/api/certificates/:id', auth, (req, res) => {
  const c = dbFindById('certificates', req.params.id);
  if (!c) return res.status(404).json({ error: 'Certificat introuvable' });
  if (c.file_url) {
    const fp = path.join(__dirname, c.file_url);
    if (fs.existsSync(fp)) fs.unlinkSync(fp);
  }
  dbDelete('certificates', req.params.id);
  res.json({ message: 'Certificat supprimé' });
});

// ── Messages ──────────────────────────────────────────────
app.post('/api/messages', (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) return res.status(400).json({ error: 'Nom, email et message sont requis' });
  dbInsert('messages', { name, email, subject: subject || '(Sans objet)', message, is_read: false });
  res.json({ message: 'Message envoyé avec succès ! Je vous répondrai bientôt.' });
});

app.get('/api/messages', auth, (req, res) => {
  const all = dbRead('messages').sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  res.json(all);
});

app.put('/api/messages/:id/read', auth, (req, res) => {
  dbUpdate('messages', req.params.id, { is_read: true });
  res.json({ message: 'Marqué comme lu' });
});

app.delete('/api/messages/:id', auth, (req, res) => {
  dbDelete('messages', req.params.id);
  res.json({ message: 'Message supprimé' });
});

// ─── Gestionnaire d'erreurs global (toujours JSON) ────────
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('[Erreur Express]', err.message);
  if (res.headersSent) return;
  // Erreurs Multer (upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'Fichier trop volumineux' });
  }
  res.status(err.status || 500).json({ error: err.message || 'Erreur interne du serveur' });
});

// ─── SPA fallback — React Router gère toutes les routes ───
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ─── Démarrage ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log('\n╔══════════════════════════════════════════════╗');
  console.log('║   Portfolio — Serigne Saliou GNINGUE         ║');
  console.log('╠══════════════════════════════════════════════╣');
  console.log(`║  🌐  Portfolio : http://localhost:${PORT}         ║`);
  console.log(`║  🔒  Admin     : http://localhost:${PORT}/admin    ║`);
  console.log('╠══════════════════════════════════════════════╣');
  console.log('║  📱  Identifiants Admin :                     ║');
  console.log('║      Tél  : 77 746 27 82  ou  76 181 15 74   ║');
  console.log('║      Pass : Ssgningue15@yahoo.com             ║');
  console.log('╚══════════════════════════════════════════════╝\n');
});
