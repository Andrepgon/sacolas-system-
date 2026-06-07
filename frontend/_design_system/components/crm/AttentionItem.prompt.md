AttentionItem — one actionable line in the consolidated "Precisa de atenção hoje" panel: tone dot + label + count + chevron to a filtered list.

```jsx
<AttentionItem tone="amber" label="Clientes pra reativar" count={5} onClick={…} />
<AttentionItem tone="danger" label="Em risco — sem comprar há +60 dias" count={3} />
<AttentionItem tone="info" label="Leads sem resposta há +3 dias" count={2} />
```

Tones: `amber` (at-risk), `danger` (high-risk), `info` (leads). Stack three inside one Card to replace the old three stacked blocks.
