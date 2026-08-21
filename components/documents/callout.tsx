import * as React from 'react'
import { CheckCircle2Icon, InfoIcon, TriangleAlertIcon } from 'lucide-react'

import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { cn } from '@/lib/utils'

export type CalloutVariant = 'info' | 'success' | 'warning' | 'destructive'

export interface CalloutProps {
  variant?: CalloutVariant
  title?: React.ReactNode
  children: React.ReactNode
}

const variantClasses: Record<CalloutVariant, string> = {
  info: 'border-primary/30 bg-secondary text-secondary-foreground',
  success: 'border-success/30 bg-success-foreground text-foreground',
  warning: 'border-warning/30 bg-warning-foreground text-foreground',
  destructive: '',
}

const variantIcons = {
  info: InfoIcon,
  success: CheckCircle2Icon,
  warning: TriangleAlertIcon,
  destructive: TriangleAlertIcon,
} satisfies Record<CalloutVariant, React.ComponentType>

export function Callout({ variant = 'info', title, children }: CalloutProps) {
  const Icon = variantIcons[variant]

  return (
    <Alert
      variant={variant === 'destructive' ? 'destructive' : 'default'}
      className={cn(variantClasses[variant])}
    >
      <Icon aria-hidden="true" />
      {title ? <AlertTitle>{title}</AlertTitle> : null}
      <AlertDescription>{children}</AlertDescription>
    </Alert>
  )
}
