import * as React from 'react'
import type { NavItem } from './Sidebar'

/**
 * BottomTabBar — mobile fixed bottom nav (4–5 tabs). Active tab tints amber;
 * a `new` item renders as a filled amber circle. The real mobile-first nav.
 */
export interface BottomTabBarProps extends React.HTMLAttributes<HTMLElement> {
  /** Tabs; items with `isNew: true` render as the amber + circle. */
  items?: (NavItem & { isNew?: boolean })[]
  active?: string
  onNavigate?: (key: string) => void
}

export function BottomTabBar(props: BottomTabBarProps): React.JSX.Element
