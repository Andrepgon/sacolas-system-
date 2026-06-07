Sidebar — fixed 220px desktop left rail. Active item = slate-100 fill + 2px amber accent bar. Includes the amber "+ Novo" action.

```jsx
<Sidebar active="contacts" logoSrc="assets/logo-mark.png"
  onNavigate={(k) => go(k)} onNew={newContact} />
```

Defaults to the CRM nav set. On mobile, swap this for BottomTabBar at the `md` breakpoint. Pair with `--sidebar-width` for the content offset.
