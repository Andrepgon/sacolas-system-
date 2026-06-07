ContactRow — a dense contacts-list line: initials avatar + name + business/phone, with status badge and LTV on the right. Hairline divider, not a floating card.

```jsx
<ContactRow name="Maria Souza" business="Papelaria Aurora" status="customer"
  ltv="R$ 2.480" lastOrder="há 12 dias" onClick={open} />
```

Stack rows inside a single bordered Card (`padded={false}`) so the dividers read as one table. For "needs attention" views, append a WhatsApp quick-action button to the right.
