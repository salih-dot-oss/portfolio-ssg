import { useEffect, useRef } from 'react'

/**
 * Hook pour les animations au scroll (IntersectionObserver).
 * Place la ref sur le conteneur — tous les enfants .reveal seront animés.
 */
export function useReveal(threshold = 0.12) {
  const ref = useRef(null)

  useEffect(() => {
    if (!ref.current) return

    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible')
          observer.unobserve(e.target)
        }
      }),
      { threshold }
    )

    const el = ref.current
    // Observer l'élément lui-même s'il a la classe reveal
    if (el.classList.contains('reveal')) observer.observe(el)
    // Observer tous les enfants .reveal
    el.querySelectorAll('.reveal').forEach(child => observer.observe(child))

    return () => observer.disconnect()
  }, [threshold])

  return ref
}
