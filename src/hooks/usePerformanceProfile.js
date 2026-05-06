import { useEffect, useMemo, useState } from 'react'

const INITIAL_PROFILE = {
  saveData: false,
  slowNetwork: false,
  lowMemory: false,
  lowCpu: false,
  reducedMotion: false,
}

function readProfile() {
  const nav = navigator
  const connection = nav.connection || nav.mozConnection || nav.webkitConnection

  const saveData = Boolean(connection?.saveData)
  const effectiveType = connection?.effectiveType || ''
  const slowNetwork = /(^|-)2g$/.test(effectiveType) || effectiveType === 'slow-2g' || effectiveType === '3g'
  const lowMemory = typeof nav.deviceMemory === 'number' ? nav.deviceMemory <= 4 : false
  const lowCpu = typeof nav.hardwareConcurrency === 'number' ? nav.hardwareConcurrency <= 4 : false
  const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false

  return {
    saveData,
    slowNetwork,
    lowMemory,
    lowCpu,
    reducedMotion,
  }
}

export function usePerformanceProfile() {
  const [profile, setProfile] = useState(INITIAL_PROFILE)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateProfile = () => {
      setProfile(readProfile())
    }

    updateProfile()

    const nav = navigator
    const connection = nav.connection || nav.mozConnection || nav.webkitConnection
    connection?.addEventListener?.('change', updateProfile)

    const motionQuery = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    motionQuery?.addEventListener?.('change', updateProfile)

    return () => {
      connection?.removeEventListener?.('change', updateProfile)
      motionQuery?.removeEventListener?.('change', updateProfile)
    }
  }, [])

  const shouldReduceEffects = useMemo(() => {
    return profile.saveData || profile.slowNetwork || profile.lowMemory || profile.lowCpu || profile.reducedMotion
  }, [profile])

  return {
    ...profile,
    shouldReduceEffects,
  }
}
