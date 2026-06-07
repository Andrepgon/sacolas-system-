Card — the base surface. White, slate-200 hairline, radius-lg, soft-to-no shadow.

```jsx
<Card title="Receita & pedidos por mês">{chart}</Card>
<Card muted>{kpi}</Card>
<Card interactive onClick={open}>{row}</Card>
```

`muted` drops the border for a slate-100 fill (KPI/metric cards). `interactive` adds hover + pointer. Set `padded={false}` to host tables flush to the edge.
