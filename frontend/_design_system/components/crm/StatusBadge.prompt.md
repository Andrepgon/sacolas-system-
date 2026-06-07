StatusBadge — maps a contact or order status key to its tone, pt-BR label, and dot. The single source of truth for status color across the app.

```jsx
<StatusBadge status="customer" />        {/* Cliente, green */}
<StatusBadge status="vector_pending" />  {/* Aguardando vetor, blue */}
<StatusBadge status="cancelled" />       {/* Cancelado, red */}
```

Contact keys: `lead`, `customer`, `inactive`, `churned`. Order keys: `quote`, `confirmed`, `vector_pending`, `factory_pending`, `printing`, `ready_to_deliver`, `delivered`, `paid`, `cancelled`. Pass `dot={false}` to drop the dot, or `label` to override text.
