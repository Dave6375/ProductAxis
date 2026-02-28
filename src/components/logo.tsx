'use client'

import React from 'react'
import { cn } from "@/lib/utils"

export default function Logo({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <svg
        viewBox="0 0 100 60"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-8 h-8 md:w-10 md:h-10 text-primary"
      >
        {/* Main body of the panties */}
        <path
          d="M10 10 
             C 10 10, 50 20, 90 10 
             L 95 15 
             C 95 15, 80 50, 50 55 
             C 20 50, 5 15, 5 15 
             Z"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {/* Top band / elastic */}
        <path
          d="M10 10 C 10 10, 50 20, 90 10"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Leg hole details */}
        <path
          d="M15 17 C 25 40, 45 50, 50 50 M85 17 C 75 40, 55 50, 50 50"
          stroke="rgba(0,0,0,0.1)"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}
