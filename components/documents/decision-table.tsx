import * as React from 'react'

import { DataTable } from '@/components/documents/data-table'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export type DecisionStatus = 'CONFIRMED' | 'PENDING'

export interface DecisionRow {
  item: React.ReactNode
  status: DecisionStatus
  detail: React.ReactNode
}

export interface DecisionTableProps {
  title?: string
  rows: readonly DecisionRow[]
}

const statusLabels: Record<DecisionStatus, string> = {
  CONFIRMED: '확정',
  PENDING: '확인 대기',
}

export function DecisionTable({ title = '결정 사항', rows }: DecisionTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={['항목', '상태', '내용']}
          rows={rows.map(({ item, status, detail }) => [
            item,
            <Badge key={`${statusLabels[status]}-badge`} variant={status === 'CONFIRMED' ? 'secondary' : 'outline'}>
              {statusLabels[status]}
            </Badge>,
            detail,
          ])}
        />
      </CardContent>
    </Card>
  )
}
