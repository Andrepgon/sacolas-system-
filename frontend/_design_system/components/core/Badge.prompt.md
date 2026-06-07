Badge — small status pill with a subtle tint (never a loud solid). Maps the CRM's real statuses and generic semantic tones.

```jsx
<Badge variant="customer" dot>Cliente</Badge>
<Badge variant="lead">Lead</Badge>
<Badge variant="info" dot>Aguardando vetor</Badge>
```

Variants: `customer`, `lead`, `inactive` (contact statuses); `info`, `success`, `warning`, `destructive`, `outline`, `accent`. Add `dot` for a leading status dot. For order-pipeline statuses prefer the StatusBadge component, which maps each stage to a tone automatically.
