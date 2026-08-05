'use client'

import * as React from "react"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export default function AnimatedBackground() {
  const [mounted, setMounted] = useState(false)
  const { resolvedTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <div className="fixed inset-0 -z-[50] bg-background pointer-events-none" />
  }

  const isDark = resolvedTheme === "dark"

  return (
    <div className="fixed inset-0 -z-[50] overflow-hidden bg-background pointer-events-none">
      <div 
        className={`absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] max-w-[800px] max-h-[800px] rounded-full filter blur-[100px] animate-blob transition-colors duration-1000 ${
          isDark ? "bg-blue-600/20" : "bg-blue-400/30"
        }`} 
      />
      <div 
        className={`absolute top-[10%] -right-[10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] rounded-full filter blur-[100px] animate-blob animation-delay-2000 transition-colors duration-1000 ${
          isDark ? "bg-indigo-600/20" : "bg-cyan-400/30"
        }`} 
      />
      <div 
        className={`absolute -bottom-[20%] left-[20%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full filter blur-[100px] animate-blob animation-delay-4000 transition-colors duration-1000 ${
          isDark ? "bg-cyan-700/20" : "bg-sky-400/30"
        }`} 
      />
    </div>
  )
}
