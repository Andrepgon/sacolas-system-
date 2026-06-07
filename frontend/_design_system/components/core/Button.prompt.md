Button — the system's action element; `primary` is the lone kraft-amber accent, reserved for the single main action (Salvar, + Novo). Everything else is neutral.

```jsx
<Button variant="primary">Salvar</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="primary" iconLeft={<Icon name="plus" />}>Novo cliente</Button>
```

Variants: `primary` (amber), `secondary`, `outline`, `ghost`, `destructive`, `link`.
Sizes: `sm`, `default`, `lg`, `icon`. Press nudges 1px down; focus shows the amber ring.
Never make the primary full-width and giant — normal size, aligned right in forms.
