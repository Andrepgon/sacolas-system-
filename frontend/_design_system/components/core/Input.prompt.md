Input — single-line text field. Hairline border, 6px radius, amber focus ring.

```jsx
<Input placeholder="Buscar por nome ou telefone…" />
<Input invalid defaultValue="11 9999" />
```

Pass `invalid` for the error state. Pair with a 13/500 label above it. For longer entry use a styled `<textarea>` with the same border tokens.
