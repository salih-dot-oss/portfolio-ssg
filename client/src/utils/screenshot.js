/**
 * Capture automatique de l'aperçu d'un site à partir de son URL.
 *
 * Deux services gratuits sans clé d'API sont essayés dans l'ordre : si le
 * premier ne répond pas, on bascule sur le second. Tous deux renvoient
 * l'en-tête CORS `Access-Control-Allow-Origin: *`, ce qui permet de récupérer
 * l'image côté navigateur puis de la stocker dans Supabase Storage — les
 * visiteurs du portfolio ne dépendent donc jamais de ces services.
 */

// Format de capture : 1200x630 (ratio 1,90:1).
// Les cartes projet font 380x220 px, soit ~1,73:1 ; ce ratio proche évite que
// object-fit:cover ne rogne le haut de la page, là où se trouve l'identité du site.
const SHOT_WIDTH  = 1200
const SHOT_HEIGHT = 630

const PROVIDERS = [
  {
    name: 'thum.io',
    build: url => `https://image.thum.io/get/width/${SHOT_WIDTH}/crop/${SHOT_HEIGHT}/noanimate/${url}`,
  },
  {
    name: 'microlink',
    build: url => `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false` +
      `&viewport.width=${SHOT_WIDTH}&viewport.height=${SHOT_HEIGHT}&embed=screenshot.url`,
  },
]

/** Normalise une URL saisie à la main : ajoute https:// si le schéma manque. */
export function normalizeUrl(input) {
  const raw = (input || '').trim()
  if (!raw) return null
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  try {
    const u = new URL(withScheme)
    // Un hôte sans point n'est pas un domaine public exploitable
    return u.hostname.includes('.') ? u.toString() : null
  } catch {
    return null
  }
}

/** URL d'aperçu immédiat, utilisable directement dans un <img src>. */
export function previewUrl(input) {
  const url = normalizeUrl(input)
  return url ? PROVIDERS[0].build(url) : null
}

/**
 * Télécharge la capture et la renvoie sous forme de File, prêt pour uploadFile().
 * Lève une erreur explicite si aucun service n'a pu produire d'image.
 */
export async function captureScreenshot(input) {
  const url = normalizeUrl(input)
  if (!url) throw new Error("URL invalide — vérifiez le lien live du projet")

  const failures = []

  for (const provider of PROVIDERS) {
    try {
      const res = await fetch(provider.build(url), { cache: 'no-store' })
      if (!res.ok) {
        failures.push(`${provider.name}: HTTP ${res.status}`)
        continue
      }

      const blob = await res.blob()
      // Un service en échec renvoie souvent une page d'erreur ou une image vide
      if (!blob.type.startsWith('image/') || blob.size < 1024) {
        failures.push(`${provider.name}: réponse non exploitable`)
        continue
      }

      const ext = blob.type.includes('jpeg') ? 'jpg' : 'png'
      return new File([blob], `capture_${Date.now()}.${ext}`, { type: blob.type })
    } catch (e) {
      failures.push(`${provider.name}: ${e.message}`)
    }
  }

  throw new Error(`Capture impossible (${failures.join(' — ')})`)
}
