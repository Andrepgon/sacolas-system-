BottomTabBar — mobile fixed bottom nav. 4–5 tabs with labels; active tints amber, a `new` tab renders as a filled amber circle.

```jsx
<BottomTabBar active="overview" onNavigate={(k) => go(k)} />
```

Pair with Sidebar: show Sidebar from the `md` breakpoint up, BottomTabBar below. Reserve `--tabbar-height` of bottom padding on the scroll area so content isn't hidden behind it.
