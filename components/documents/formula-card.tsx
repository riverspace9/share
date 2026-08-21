import * as React from 'react'

import { DataTable } from '@/components/documents/data-table'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export interface FormulaCardProps {
  title: string
  formula: string
  description?: React.ReactNode
  examples?: readonly (readonly [React.ReactNode, React.ReactNode])[]
}

export function FormulaCard({
  title,
  formula,
  description,
  examples = [],
}: FormulaCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <h2>{title}</h2>
        </CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <code className="rounded-md bg-muted px-3 py-2 font-mono text-sm text-foreground">
          {formula}
        </code>
        {examples.length > 0 ? (
          <DataTable columns={['조건', '결과']} rows={examples} caption="계산 예시" />
        ) : null}
      </CardContent>
    </Card>
  )
}
