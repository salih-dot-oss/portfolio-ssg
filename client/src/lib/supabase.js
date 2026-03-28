import { createClient } from '@supabase/supabase-js'

const supabaseUrl     = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/** Convertit un numéro de téléphone en email Supabase Auth */
export function phoneToEmail(phone) {
  return phone.replace(/\D/g, '').slice(-9) + '@ssg.admin'
}

/** Upload un fichier dans un bucket Supabase Storage, retourne l'URL publique */
export async function uploadFile(bucket, file) {
  const ext      = file.name.split('.').pop().toLowerCase()
  const fileName = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`
  const { error } = await supabase.storage.from(bucket).upload(fileName, file)
  if (error) throw new Error(error.message)
  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(fileName)
  return publicUrl
}

/** Supprime un fichier dans un bucket à partir de son URL publique */
export async function deleteFile(bucket, publicUrl) {
  if (!publicUrl) return
  try {
    const path = publicUrl.split(`/storage/v1/object/public/${bucket}/`)[1]
    if (path) await supabase.storage.from(bucket).remove([path])
  } catch { /* ignore */ }
}
