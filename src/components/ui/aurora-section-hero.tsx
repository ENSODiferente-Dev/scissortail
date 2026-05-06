"use client"

import React, { CSSProperties, useEffect, useState } from 'react'

export interface BackgroundSceneProps {
  beamCount?: number
  className?: string
}

const BACKGROUND_BEAM_COUNT = 60

const BackgroundScene: React.FC<BackgroundSceneProps> = ({
  beamCount = BACKGROUND_BEAM_COUNT,
  className = '',
}) => {
  const [beams, setBeams] = useState<Array<{ id: number; style: CSSProperties }>>([])

  useEffect(() => {
    const generated = Array.from({ length: beamCount }).map((_, index) => {
      const riseDuration = Math.random() * 2 + 4
      const fadeDuration = riseDuration
      const dropDuration = Math.random() * 3 + 3

      return {
        id: index,
        style: {
          left: `${Math.random() * 100}%`,
          width: `${Math.floor(Math.random() * 3) + 1}px`,
          animationDelay: `${Math.random() * 5}s`,
          animationDuration: `${riseDuration}s, ${fadeDuration}s, ${dropDuration}s`,
        },
      }
    })

    setBeams(generated)
  }, [beamCount])

  return (
    <div
      className={`aurora-scene ${className}`.trim()}
      role="img"
      aria-label="Animated digital data background"
    >
      <div className="aurora-floor" />
      <div className="aurora-main-column" />
      <div className="aurora-grid" />
      <div className="aurora-light-stream-container">
        {beams.map((beam) => (
          <div key={beam.id} className="aurora-light-beam" style={beam.style} />
        ))}
      </div>
    </div>
  )
}

export default BackgroundScene

