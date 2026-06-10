'use client'

import { CampaignComposer } from '../_components/campaign-composer'

export default function NovaCampanhaPage() {
  return (
    <div className="mx-auto max-w-[1100px] px-4 py-5 md:px-6 md:py-6">
      <header className="mb-5">
        <p
          className="m-0 text-[color:var(--text-hint)]"
          style={{ fontSize: 'var(--text-hint-size)' }}
        >
          Campanhas
        </p>
        <h1
          className="m-0 mt-0.5 text-[color:var(--text-primary)]"
          style={{
            fontSize: 'var(--text-page-size)',
            lineHeight: 'var(--text-page-lh)',
            fontWeight: 'var(--weight-medium)',
            letterSpacing: 'var(--tracking-tight)',
          }}
        >
          Nova campanha
        </h1>
      </header>

      <CampaignComposer mode="new" />
    </div>
  )
}
