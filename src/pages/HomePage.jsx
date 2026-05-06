import { useEffect, useState } from 'react'
import ScissortailHero from '@/components/ui/hero'
import LegacyHtmlPage from '../components/LegacyHtmlPage'
import { useExternalScript } from '../hooks/useExternalScript'
import { useLegacyHomeInteractions } from '../hooks/useLegacyHomeInteractions'
import { usePerformanceProfile } from '../hooks/usePerformanceProfile'
import { buildLegacyHomeRemainderMarkup } from '../lib/legacyHtml'
import homeRaw from '../content/index.html?raw'

const FORM_SCRIPT_SRC = 'https://link.msgsndr.com/js/form_embed.js'
const FORM_MARKER = {
  name: 'data-script-owner',
  value: 'leadconnector-form',
}
const FORM_ATTRS = {
  'data-script-owner': 'leadconnector-form',
}
const HOME_REMAINDER_MARKUP = buildLegacyHomeRemainderMarkup(homeRaw)
const BACKGROUND_IMAGE_URL = `${import.meta.env.BASE_URL}assets/background.png`

function HomePage() {
  const { shouldReduceEffects } = usePerformanceProfile()
  const [formScriptEnabled, setFormScriptEnabled] = useState(false)

  useEffect(() => {
    let observer = null
    let frameId = 0
    let fallbackTimer = 0

    const enableFormScript = () => {
      setFormScriptEnabled((current) => (current ? current : true))
    }

    const bindEstimateObserver = () => {
      if (formScriptEnabled) return

      const estimateSection = document.getElementById('estimate')
      if (!estimateSection) {
        frameId = window.requestAnimationFrame(bindEstimateObserver)
        return
      }

      if (!('IntersectionObserver' in window)) {
        enableFormScript()
        return
      }

      observer = new IntersectionObserver(
        (entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            enableFormScript()
            observer?.disconnect()
          }
        },
        { rootMargin: '1800px 0px' },
      )

      observer.observe(estimateSection)
    }

    const onEstimateIntent = (event) => {
      const target = event.target instanceof Element ? event.target.closest('a[data-scroll-target="estimate"]') : null
      if (target) {
        enableFormScript()
      }
    }

    document.addEventListener('click', onEstimateIntent)
    bindEstimateObserver()

    // Fallback: guarantee the form script eventually loads, but later on slow profiles.
    fallbackTimer = window.setTimeout(enableFormScript, shouldReduceEffects ? 2200 : 1400)

    return () => {
      document.removeEventListener('click', onEstimateIntent)
      if (observer) {
        observer.disconnect()
      }
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.clearTimeout(fallbackTimer)
    }
  }, [formScriptEnabled, shouldReduceEffects])

  useExternalScript({
    src: FORM_SCRIPT_SRC,
    attrs: FORM_ATTRS,
    markerAttr: FORM_MARKER,
    enabled: formScriptEnabled,
  })

  useLegacyHomeInteractions()

  return (
    <div className="relative min-h-screen bg-[#050b24] text-white">
      <div
        className="pointer-events-none fixed inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')` }}
        aria-hidden="true"
      />
      <div className="relative z-10">
        <ScissortailHero />
        <LegacyHtmlPage html={HOME_REMAINDER_MARKUP} />
      </div>
    </div>
  )
}

export default HomePage
