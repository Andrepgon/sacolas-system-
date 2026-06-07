Select — styled native dropdown for filters and fixed lists. Same border/focus language as Input.

```jsx
<Select placeholder="Todos os status"
  options={[{value:'lead',label:'Leads'},{value:'customer',label:'Clientes'}]} />
<Select options={['papelaria','restaurante','boutique','confeitaria','outro']} />
```

Use for the status filter and the segment field (structured data from day one). Accepts string options or `{value,label}` pairs.
