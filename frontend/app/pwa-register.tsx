"use client"

import { useEffect } from "react"

// next-pwa gera /sw.js no build. O auto-register dele foi escrito pra Pages
// Router; no App Router precisamos disparar o register() explicitamente.
export function PWARegister() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (!("serviceWorker" in navigator)) return
    if (process.env.NODE_ENV !== "production") return

    navigator.serviceWorker.register("/sw.js").catch((err) => {
      console.error("SW register failed:", err)
    })
  }, [])

  return null
}
