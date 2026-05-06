import { useEffect } from 'react'

function getExistingScript(src, markerAttr) {
  const scripts = document.querySelectorAll(`script[src="${src}"]`)

  if (!markerAttr) {
    return scripts[0] || null
  }

  return (
    Array.from(scripts).find((script) => script.getAttribute(markerAttr.name) === markerAttr.value) ||
    null
  )
}

export function useExternalScript({ src, attrs = {}, markerAttr, enabled = true }) {
  useEffect(() => {
    if (!enabled || !src) {
      return
    }

    const existingScript = getExistingScript(src, markerAttr)
    if (existingScript) {
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true

    Object.entries(attrs).forEach(([key, value]) => {
      script.setAttribute(key, value)
    })

    if (markerAttr) {
      script.setAttribute(markerAttr.name, markerAttr.value)
    }

    document.body.appendChild(script)

    return () => {
      // Keep external widgets mounted while navigating in SPA.
    }
  }, [attrs, enabled, markerAttr, src])
}
