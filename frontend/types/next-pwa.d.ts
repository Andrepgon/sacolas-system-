declare module "next-pwa" {
  import type { NextConfig } from "next"

  type PWAOptions = {
    dest?: string
    disable?: boolean
    register?: boolean
    skipWaiting?: boolean
    sw?: string
    publicExcludes?: string[]
    buildExcludes?: (RegExp | string)[]
    runtimeCaching?: unknown
    fallbacks?: Record<string, string>
  }

  export default function withPWA(
    options: PWAOptions
  ): (nextConfig: NextConfig) => NextConfig
}
