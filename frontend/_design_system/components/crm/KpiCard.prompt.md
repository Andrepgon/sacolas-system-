KpiCard — the dashboard metric card. Borderless slate-100 fill, label, big mono value, optional delta and sub-line. Every number answers a business question.

```jsx
<KpiCard label="Receita do mês" value="R$ 12.480" delta="18%" deltaDir="up"
  sub="Ticket médio R$ 312" />
<KpiCard label="Leads abertos" value="7" sub="2 sem resposta" alertSub />
```

`deltaDir` controls arrow + color (`up`=green ▲, `down`=red ▼, `flat`=grey). Use `alertSub` to flag a sub-line in red. Lay four across in a grid: 4 cols desktop → 2 tablet → 1 mobile.
