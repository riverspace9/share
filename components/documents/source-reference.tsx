import * as React from 'react'
import { ExternalLinkIcon } from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export interface SourceReferenceProps {
  title: string
  href: string
  description?: React.ReactNode
}

export function SourceReference({ title, href, description }: SourceReferenceProps) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardTitle>
          <a
            className="inline-flex items-center gap-1 text-primary underline-offset-4 hover:underline"
            href={href}
            target="_blank"
            rel="noreferrer"
          >
            {title}
            <ExternalLinkIcon aria-hidden="true" />
          </a>
        </CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="font-mono text-xs text-muted-foreground">{href}</CardContent>
    </Card>
  )
}
