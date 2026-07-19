// components/site/festive-decor.tsx
// Si-Si — festive decoration layer: floating flowers and balloons.
// Purely decorative: aria-hidden, pointer-events-none, rendered behind content.
// Server-component safe (no hooks, no client directives) — drop it inside any
// relatively-positioned section to make the background feel like a celebration.
//
// Two variants:
//   hero    — richer composition for the flagship hero screen
//   section — light, subtle accents for regular content sections

import React from 'react'

const PINK = '#E7AAB9'
const PINK_SOFT = '#F3CBD5'
const GOLD = '#C8A96E'
const GOLD_DEEP = '#AE8A3E'
const CREAM = '#FFF3D6'

// ---------------------------------------------------------------------------
// Five-petal blossom
// ---------------------------------------------------------------------------

interface FlowerProps {
  size?: number
  petal?: string
  center?: string
  className?: string
}

function Flower({ size = 52, petal = PINK, center = GOLD, className }: FlowerProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g opacity="0.92">
        {[0, 72, 144, 216, 288].map((deg) => (
          <ellipse
            key={deg}
            cx="32"
            cy="14"
            rx="9"
            ry="14"
            fill={petal}
            transform={`rotate(${deg} 32 32)`}
          />
        ))}
        <circle cx="32" cy="32" r="7.5" fill={center} />
        <circle cx="32" cy="32" r="3" fill={GOLD_DEEP} opacity="0.55" />
      </g>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Balloon with knot and wavy string
// ---------------------------------------------------------------------------

interface BalloonProps {
  size?: number
  color?: string
  className?: string
}

function Balloon({ size = 60, color = PINK, className }: BalloonProps) {
  const height = Math.round(size * 1.6)
  return (
    <svg
      viewBox="0 0 60 96"
      width={size}
      height={height}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M30 4 C15 4 5 17 5 31 C5 46 17 57 30 57 C43 57 55 46 55 31 C55 17 45 4 30 4 Z"
        fill={color}
      />
      <ellipse cx="21" cy="22" rx="6" ry="10" fill="#FFFFFF" opacity="0.38" />
      <path d="M30 57 L26 64 L34 64 Z" fill={color} />
      <path
        d="M30 64 C 26 72, 34 78, 30 86 C 28 90, 30 93, 30 95"
        stroke={color}
        strokeWidth="1.6"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Positioned wrapper — absolute position + gentle float animation
// ---------------------------------------------------------------------------

interface FloatSpotProps {
  className: string
  delay?: string
  slow?: boolean
  children: React.ReactNode
}

function FloatSpot({ className, delay, slow, children }: FloatSpotProps) {
  return (
    <div
      className={`absolute ${slow ? 'animate-float-slow' : 'animate-float'} ${className}`}
      style={delay ? { animationDelay: delay } : undefined}
    >
      {children}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Public component
// ---------------------------------------------------------------------------

export interface FestiveDecorProps {
  variant?: 'hero' | 'section'
}

export function FestiveDecor({ variant = 'section' }: FestiveDecorProps) {
  if (variant === 'hero') {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Balloons */}
        <FloatSpot className="left-[4%] top-[14%]">
          <Balloon size={64} color={PINK} className="-rotate-6" />
        </FloatSpot>
        <FloatSpot className="left-[13%] bottom-[24%]" delay="1.4s" slow>
          <Balloon size={46} color={GOLD} className="rotate-3 opacity-90" />
        </FloatSpot>
        <FloatSpot className="right-[3%] top-[9%]" delay="0.8s" slow>
          <Balloon size={56} color={CREAM} className="rotate-6" />
        </FloatSpot>
        <FloatSpot className="right-[10%] bottom-[30%]" delay="2.1s">
          <Balloon size={40} color={PINK_SOFT} className="-rotate-3 opacity-90" />
        </FloatSpot>

        {/* Flowers */}
        <FloatSpot className="left-[38%] top-[10%]" delay="0.6s" slow>
          <Flower size={44} className="rotate-12" />
        </FloatSpot>
        <FloatSpot className="left-[7%] bottom-[10%]" delay="1.8s">
          <Flower size={56} petal={PINK_SOFT} className="-rotate-6" />
        </FloatSpot>
        <FloatSpot className="right-[30%] bottom-[12%]" delay="1s" slow>
          <Flower size={38} className="rotate-45 opacity-90" />
        </FloatSpot>
        <FloatSpot className="right-[6%] top-[46%]" delay="2.6s">
          <Flower size={34} petal={PINK_SOFT} center={GOLD_DEEP} className="rotate-12 opacity-80" />
        </FloatSpot>
      </div>
    )
  }

  // Subtle variant for regular sections
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <FloatSpot className="right-[3%] top-10" slow>
        <Flower size={44} className="rotate-12 opacity-60" />
      </FloatSpot>
      <FloatSpot className="left-[2%] bottom-14" delay="1.5s" slow>
        <Balloon size={40} color={PINK_SOFT} className="-rotate-6 opacity-50" />
      </FloatSpot>
      <FloatSpot className="right-[8%] bottom-10" delay="0.9s">
        <Flower size={32} petal={PINK_SOFT} className="-rotate-12 opacity-50" />
      </FloatSpot>
    </div>
  )
}

export default FestiveDecor
