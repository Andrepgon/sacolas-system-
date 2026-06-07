import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Styleguide — Sacolas CRM',
  description: 'Fundação visual: paleta, tipografia e tokens.',
}

export default function StyleguideLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
