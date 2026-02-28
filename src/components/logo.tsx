'use client'

import React from 'react'
import { cn } from "../lib/utils"

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 md:w-10 md:h-10 text-primary"
      >
        {/* Main body of the panties (Bikini/Lace style) */}
        <path
          d="M10 12 
             C 10 12, 50 25, 90 12 
             L 92 18 
             C 92 18, 85 45, 50 55 
             C 15 45, 8 18, 8 18 
             Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        {/* Lace trim along the top */}
        <path
          d="M10 12 C 15 15, 20 12, 25 15 C 30 12, 35 15, 40 12 C 45 15, 50 12, 55 15 C 60 12, 65 15, 70 12 C 75 15, 80 12, 85 15 C 90 12, 90 12, 90 12"
          stroke="rgba(255,255,255,0.4)"
          strokeWidth="1"
          fill="none"
        />
        {/* Tiny decorative bow in the center */}
        <path
          d="M47 18 L53 22 M53 18 L47 22"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <circle cx="50" cy="20" r="1" fill="white" />
        {/* Leg hole curves */}
        <path
          d="M15 22 C 25 38, 45 48, 50 48 M85 22 C 75 38, 55 48, 50 48"
          stroke="rgba(0,0,0,0.15)"
          strokeWidth="0.8"
          fill="none"
        />
      </svg>
    </div>
  )
}
