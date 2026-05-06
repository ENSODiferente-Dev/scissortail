import { useEffect } from 'react'
import { usePerformanceProfile } from './usePerformanceProfile'

export function useLegacyHomeInteractions() {
  const { shouldReduceEffects } = usePerformanceProfile()

  useEffect(() => {
    const mobileMenu = document.getElementById('mobile-menu')
    const mobileMenuPanel = document.getElementById('mobile-menu-panel')
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle')
    const mobileMenuClose = document.getElementById('mobile-menu-close')
    const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop')

    if (!mobileMenu || !mobileMenuPanel || !mobileMenuToggle || !mobileMenuClose || !mobileMenuBackdrop) {
      return
    }

    const mobileMenuLinks = mobileMenu.querySelectorAll('a[href]')
    let isMobileMenuOpen = false

    const setMobileMenuState = (open) => {
      isMobileMenuOpen = open
      mobileMenuToggle.setAttribute('aria-expanded', String(open))
      mobileMenu.setAttribute('aria-hidden', String(!open))
      document.body.classList.toggle('overflow-hidden', open)

      if (open) {
        mobileMenu.classList.remove('hidden')
        requestAnimationFrame(() => {
          mobileMenuBackdrop.classList.remove('opacity-0')
          mobileMenuBackdrop.classList.add('opacity-100')
          mobileMenuPanel.classList.remove('-translate-x-full')
          mobileMenuPanel.classList.add('translate-x-0')
        })
        return
      }

      mobileMenuBackdrop.classList.remove('opacity-100')
      mobileMenuBackdrop.classList.add('opacity-0')
      mobileMenuPanel.classList.remove('translate-x-0')
      mobileMenuPanel.classList.add('-translate-x-full')

      window.setTimeout(() => {
        if (!isMobileMenuOpen) {
          mobileMenu.classList.add('hidden')
        }
      }, 300)
    }

    const openMenu = () => setMobileMenuState(true)
    const closeMenu = () => setMobileMenuState(false)
    const closeOnLink = () => setMobileMenuState(false)
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        closeMenu()
      }
    }

    mobileMenuToggle.addEventListener('click', openMenu)
    mobileMenuClose.addEventListener('click', closeMenu)
    mobileMenuBackdrop.addEventListener('click', closeMenu)
    mobileMenuLinks.forEach((link) => link.addEventListener('click', closeOnLink))
    document.addEventListener('keydown', handleEscape)

    return () => {
      mobileMenuToggle.removeEventListener('click', openMenu)
      mobileMenuClose.removeEventListener('click', closeMenu)
      mobileMenuBackdrop.removeEventListener('click', closeMenu)
      mobileMenuLinks.forEach((link) => link.removeEventListener('click', closeOnLink))
      document.removeEventListener('keydown', handleEscape)
      document.body.classList.remove('overflow-hidden')
    }
  }, [])

  useEffect(() => {
    const links = document.querySelectorAll('a[data-scroll-target]')

    const onClick = (event) => {
      event.preventDefault()
      const targetId = event.currentTarget.getAttribute('data-scroll-target')

      if (!targetId || targetId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }

      const targetElement = document.getElementById(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }

    links.forEach((link) => link.addEventListener('click', onClick))

    return () => {
      links.forEach((link) => link.removeEventListener('click', onClick))
    }
  }, [])

  useEffect(() => {
    const cards = Array.from(document.querySelectorAll('[data-services-card]'))
    if (!cards.length) return

    cards.forEach((card, index) => {
      card.style.setProperty('--scan-delay', `${index * 52}ms`)
    })

    if (shouldReduceEffects || !('IntersectionObserver' in window)) {
      cards.forEach((card) => card.classList.add('is-visible'))
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const card = entry.target
          card.classList.add('is-visible')
          observer.unobserve(card)
        })
      },
      {
        threshold: 0.14,
        rootMargin: '0px 0px -2% 0px',
      },
    )

    cards.forEach((card) => observer.observe(card))

    return () => {
      observer.disconnect()
    }
  }, [shouldReduceEffects])

  useEffect(() => {
    const aboutItems = Array.from(document.querySelectorAll('[data-about-item]'))
    const formReveal = document.querySelector('[data-form-reveal]')

    if (!aboutItems.length && !formReveal) {
      return
    }

    aboutItems.forEach((item, index) => {
      item.style.setProperty('--about-delay', `${index * 48}ms`)
    })

    if (shouldReduceEffects || !('IntersectionObserver' in window)) {
      aboutItems.forEach((item) => item.classList.add('is-visible'))
      formReveal?.classList.add('is-visible')
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px 18% 0px',
      },
    )

    aboutItems.forEach((item) => observer.observe(item))
    if (formReveal) {
      observer.observe(formReveal)
    }

    return () => {
      observer.disconnect()
    }
  }, [shouldReduceEffects])

  useEffect(() => {
    const servicesSection = document.getElementById('services')
    const servicesPin = servicesSection?.querySelector('[data-services-pin]')
    const servicesViewport = servicesSection?.querySelector('[data-services-viewport]')
    const servicesTrack = servicesSection?.querySelector('[data-services-track]')

    if (!servicesSection || !servicesPin || !servicesViewport || !servicesTrack) {
      return
    }

    if (shouldReduceEffects) {
      servicesPin.style.height = ''
      servicesTrack.style.transform = ''
      return
    }

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value))
    let frameId = 0
    let maxShift = 0
    let pinScrollDistance = 0
    let stickyTop = 0
    let shouldMeasure = true

    const measure = () => {
      servicesTrack.style.transform = 'translate3d(0, 0, 0)'

      const viewportHeight = servicesViewport.getBoundingClientRect().height
      const computedTop = Number.parseFloat(window.getComputedStyle(servicesViewport).top || '0')
      stickyTop = Number.isNaN(computedTop) ? 0 : computedTop
      maxShift = Math.max(0, servicesTrack.scrollWidth - servicesViewport.clientWidth)
      pinScrollDistance = Math.max(520, maxShift * 0.62)

      const pinHeight = Math.max(viewportHeight, viewportHeight + pinScrollDistance + stickyTop)
      servicesPin.style.height = `${Math.ceil(pinHeight)}px`
    }

    const updateTrackPosition = () => {
      frameId = 0

      if (shouldMeasure) {
        measure()
        shouldMeasure = false
      }

      if (maxShift <= 0) {
        servicesTrack.style.transform = 'translate3d(0, 0, 0)'
        return
      }

      const pinRect = servicesPin.getBoundingClientRect()
      const progressPx = clamp(stickyTop - pinRect.top, 0, pinScrollDistance)
      const progressRatio = pinScrollDistance > 0 ? progressPx / pinScrollDistance : 0
      const translateX = -maxShift * progressRatio
      servicesTrack.style.transform = `translate3d(${translateX}px, 0, 0)`
    }

    const requestUpdate = () => {
      if (frameId) return
      frameId = window.requestAnimationFrame(updateTrackPosition)
    }

    const onResize = () => {
      shouldMeasure = true
      requestUpdate()
    }

    const onLoad = () => {
      shouldMeasure = true
      requestUpdate()
    }

    requestUpdate()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('load', onLoad)

    return () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId)
      }
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('load', onLoad)
      servicesPin.style.height = ''
      servicesTrack.style.transform = ''
    }
  }, [shouldReduceEffects])
}
