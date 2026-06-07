import * as React from 'react'
import { cn } from '@/lib/utils'
import { initials } from './_utils'

const sizeMap = {
  sm: 'w-7 h-7 text-[11px]',
  default: 'w-9 h-9 text-[13px]',
  lg: 'w-11 h-11 text-[15px]',
}

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  name?: string
  src?: string | null
  size?: keyof typeof sizeMap
}

export function Avatar({
  name = '',
  src = null,
  size = 'default',
  className,
  ...props
}: AvatarProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-[var(--slate-100)] text-[color:var(--slate-600)] font-sans font-medium uppercase shrink-0 overflow-hidden',
        sizeMap[size],
        className
      )}
      {...props}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        initials(name)
      )}
    </span>
  )
}
