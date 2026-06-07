import type { Metadata, Viewport } from 'next'
import localFont from 'next/font/local'
import './globals.css'
import { AppShell } from '@/components/app-shell'
import { PWARegister } from './pwa-register'
import { Toaster } from '@/components/ui/sonner'

const geistSans = localFont({
  src: '../_design_system/assets/fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
  display: 'swap',
})

const geistMono = localFont({
  src: '../_design_system/assets/fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Sacolas CRM',
  description: 'CRM mobile-first para gestao de clientes e pedidos',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Sacolas',
  },
}

export const viewport: Viewport = {
  themeColor: '#ba7517',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="font-sans">
        <PWARegister />
        <AppShell>{children}</AppShell>
        <Toaster />
      </body>
    </html>
  )
}
