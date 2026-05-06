"use client"

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { PhoneCall } from 'lucide-react'
import BackgroundScene from '@/components/ui/aurora-section-hero'
import { usePerformanceProfile } from '@/hooks/usePerformanceProfile'

export default function ScissortailHero() {
  const heroRef = useRef(null)
  const particleRefs = useRef([])
  const pointerRef = useRef({ x: 0, y: 0, active: false })
  const frameRef = useRef(0)
  const [isHeroInView, setIsHeroInView] = useState(true)
  const logoSrc = `${import.meta.env.BASE_URL}assets/Logo.svg`
  const { shouldReduceEffects } = usePerformanceProfile()
  const particleCount = shouldReduceEffects ? 12 : 42
  const particles = useMemo(
    () =>
      Array.from({ length: particleCount }, (_, index) => ({
        id: index,
        left: Math.random() * 100,
        top: Math.random() * 100,
        size: 1.2 + Math.random() * 3.8,
        driftX: 8 + Math.random() * 24,
        driftY: 7 + Math.random() * 22,
        speed: 0.35 + Math.random() * 0.9,
        phase: Math.random() * Math.PI * 2,
        magnet: 10 + Math.random() * 24,
        radius: 120 + Math.random() * 180,
        alpha: 0.18 + Math.random() * 0.42,
      })),
    [particleCount],
  )

  useEffect(() => {
    const root = heroRef.current
    if (!root) return

    if (!('IntersectionObserver' in window)) {
      setIsHeroInView(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsHeroInView(entry.isIntersecting)
        })
      },
      { threshold: 0.08 },
    )

    observer.observe(root)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const root = heroRef.current
    if (!root || shouldReduceEffects || !isHeroInView) return

    const onMouseMove = (event) => {
      const rect = root.getBoundingClientRect()
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        active: true,
      }
    }
    const onMouseLeave = () => {
      pointerRef.current.active = false
    }

    root.addEventListener('mousemove', onMouseMove)
    root.addEventListener('mouseleave', onMouseLeave)

    let width = root.clientWidth
    let height = root.clientHeight
    const onResize = () => {
      width = root.clientWidth
      height = root.clientHeight
    }
    window.addEventListener('resize', onResize)

    const startTime = performance.now()

    const render = (now) => {
      if (!isHeroInView) {
        frameRef.current = 0
        return
      }

      const elapsed = (now - startTime) / 1000
      const pointer = pointerRef.current

      for (let i = 0; i < particles.length; i += 1) {
        const particle = particles[i]
        const node = particleRefs.current[i]
        if (!node) continue

        const baseX = (particle.left / 100) * width
        const baseY = (particle.top / 100) * height
        const driftX = Math.sin(elapsed * particle.speed + particle.phase) * particle.driftX
        const driftY = Math.cos(elapsed * (particle.speed * 0.85) + particle.phase) * particle.driftY
        const currentX = baseX + driftX
        const currentY = baseY + driftY

        let magneticX = 0
        let magneticY = 0
        let glowBoost = 0

        if (pointer.active) {
          const dx = pointer.x - currentX
          const dy = pointer.y - currentY
          const distance = Math.hypot(dx, dy) || 1
          const pull = Math.max(0, 1 - distance / particle.radius)
          const influence = pull * particle.magnet * 0.42

          magneticX = (dx / distance) * influence
          magneticY = (dy / distance) * influence
          glowBoost = pull * 0.45
        }

        node.style.transform = `translate3d(${driftX + magneticX}px, ${driftY + magneticY}px, 0) scale(${1 + glowBoost * 0.5})`
        node.style.opacity = String(Math.min(0.95, particle.alpha + glowBoost))
      }

      frameRef.current = requestAnimationFrame(render)
    }

    frameRef.current = requestAnimationFrame(render)

    return () => {
      cancelAnimationFrame(frameRef.current)
      frameRef.current = 0
      root.removeEventListener('mousemove', onMouseMove)
      root.removeEventListener('mouseleave', onMouseLeave)
      window.removeEventListener('resize', onResize)
    }
  }, [particles, shouldReduceEffects, isHeroInView])

  return (
    <div ref={heroRef} className="relative min-h-screen overflow-hidden bg-[#050b24] text-white">
      <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_20%_22%,rgba(37,99,235,0.24),transparent_46%),radial-gradient(circle_at_84%_12%,rgba(239,68,68,0.2),transparent_40%),linear-gradient(180deg,#04081d_0%,#050b24_44%,#03071a_100%)]" />
      {!shouldReduceEffects && isHeroInView ? (
        <BackgroundScene beamCount={42} className="pointer-events-none absolute inset-0 z-[1]" />
      ) : null}
      {isHeroInView ? (
        <div className="pointer-events-none absolute inset-0 z-[2] overflow-hidden">
          {particles.map((particle, index) => (
            <span
              key={particle.id}
              ref={(node) => {
                particleRefs.current[index] = node
              }}
              className="absolute rounded-full bg-blue-200/70"
              style={{
                left: `${particle.left}%`,
                top: `${particle.top}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                opacity: particle.alpha,
                filter: 'blur(0.25px)',
                transform: 'translate3d(0,0,0)',
                willChange: 'transform, opacity',
              }}
            />
          ))}
        </div>
      ) : null}

      <header className="relative z-20 bg-[#060619]/20 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:gap-4 sm:px-6 lg:px-8">
          <a href="#/" className="flex min-w-0 flex-1 items-center gap-2 py-1 pr-2 sm:gap-3">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center p-1 sm:h-16 sm:w-16">
              <img src={logoSrc} alt="Scissortail Comfort Solutions LLC logo" className="h-full w-auto scale-125" />
            </span>
            <span className="min-w-0 text-center sm:text-left">
              <span className="block text-base font-bold leading-tight text-white sm:text-2xl">
                Scissortail Comfort Solutions LLC
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-2 md:flex">
            <a
              href="#/"
              data-scroll-target="about"
              className="inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-base font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              About Us
            </a>
            <a
              href="#/"
              data-scroll-target="services"
              className="inline-flex min-h-11 items-center justify-center rounded-full px-4 py-2 text-base font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
            >
              Services
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <a href="tel:+14056659110" className="hidden text-right sm:block">
              <span className="block text-xs font-semibold uppercase tracking-[0.25em] text-blue-200">Call Anytime</span>
              <span className="text-lg font-bold text-white">+1 (405) 665 9110</span>
            </a>

            <a
              href="#/"
              data-scroll-target="estimate"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-red-600 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
            >
              Free Estimate
            </a>
          </div>
        </div>
      </header>

      <main className="relative z-20 mx-auto flex min-h-[calc(100vh-92px)] w-full max-w-7xl items-center px-4 py-9 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="pointer-events-none absolute inset-0 z-0 flex items-end justify-end">
          <motion.aside
            className="relative -bottom-14 right-[-22%] flex w-full items-center justify-end sm:-bottom-32 sm:right-[-8%] lg:-bottom-40 lg:right-[-14%] xl:right-[-18%]"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
          >
            <img
              src={logoSrc}
              alt="Scissortail Comfort Solutions LLC logo"
              className="h-auto w-[min(132vw,760px)] opacity-25 drop-shadow-[0_28px_42px_rgba(2,6,23,0.6)] sm:w-[min(110vw,920px)] sm:opacity-30 lg:w-[min(72vw,920px)]"
            />
          </motion.aside>
        </div>

        <div className="relative z-10 grid w-full items-center gap-8 sm:gap-10">
          <div className="relative max-w-[54rem] lg:flex lg:min-h-[calc(100vh-220px)] lg:flex-col lg:justify-end lg:pb-5">
          <motion.span
            className="mt-8 inline-flex max-w-full flex-wrap items-center text-sm font-semibold leading-6 text-white/90 sm:mt-10 lg:mt-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Trusted HVAC Service for Oklahoma Homes &amp; Businesses
          </motion.span>

          <motion.h1
            className="mt-5 text-3xl font-extrabold leading-tight text-white sm:mt-5 sm:text-5xl lg:text-6xl"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.35 }}
          >
            Keeping Oklahoma
            <span className="block">Comfortable Year-Round</span>
          </motion.h1>

          <motion.p
            className="mt-5 max-w-2xl text-base leading-7 text-white/90 sm:text-xl sm:leading-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.65 }}
          >
            Professional Residential &amp; Commercial HVAC Services. Licensed &amp; Insured.
          </motion.p>

          <motion.div
            className="mt-10 flex w-full flex-col gap-3 sm:mt-12 sm:flex-row lg:mt-12 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <a
              href="tel:+14056659110"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-red-600 px-5 py-4 text-center text-base font-bold text-white shadow-[0_20px_45px_rgba(15,23,42,0.16)] transition hover:bg-red-500 sm:w-auto"
            >
              <PhoneCall className="h-5 w-5 shrink-0" aria-hidden="true" />
              Call Now for 24/7 Emergency Service
            </a>
          </motion.div>

          <motion.div
            className="mt-14 grid w-full gap-3 sm:mt-20 sm:grid-cols-3 sm:gap-5 lg:relative lg:mt-[10px] lg:top-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.05 }}
          >
            <div className="rounded-2xl border border-white/15 bg-slate-950/20 px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
              <p className="text-2xl font-extrabold text-white">24/7</p>
              <p className="mt-1 text-sm font-medium text-slate-100">Emergency response when comfort can’t wait.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-slate-950/20 px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
              <p className="text-2xl font-extrabold text-white">Licensed</p>
              <p className="mt-1 text-sm font-medium text-slate-100">Qualified service for residential and commercial systems.</p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-slate-950/20 px-5 py-4 backdrop-blur-sm sm:px-6 sm:py-5">
              <p className="text-2xl font-extrabold text-white">Free</p>
              <p className="mt-1 text-sm font-medium text-slate-100">Clear estimates before work begins.</p>
            </div>
          </motion.div>
          </div>
        </div>
      </main>

    </div>
  )
}
