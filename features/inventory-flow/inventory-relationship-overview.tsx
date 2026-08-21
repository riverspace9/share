import * as React from 'react'

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { MermaidDiagram } from '@/components/documents/mermaid-diagram'
import { inventoryFlowDiagram } from '@/content/diagrams'
import { cn } from '@/lib/utils'

interface TableGroupSection {
  label?: string
  tables: readonly string[]
}

interface TableGroup {
  title: string
  prefix: string
  cardClassName: string
  titleClassName: string
  sections: readonly TableGroupSection[]
}

const tableGroups: readonly TableGroup[] = [
  {
    title: '플라워',
    prefix: 'FevFlowerOrder*',
    cardClassName: 'border-[var(--diagram-flower-stroke)] bg-[var(--diagram-flower-fill)] ring-0',
    titleClassName: 'text-[var(--diagram-flower-text)]',
    sections: [
      { tables: ['FevFlowerOrders', 'FevFlowerOrderItems'] },
    ],
  },
  {
    title: '재고 이관',
    prefix: 'InvTransfer*',
    cardClassName: 'border-[var(--diagram-transfer-stroke)] bg-[var(--diagram-transfer-fill)] ring-0',
    titleClassName: 'text-[var(--diagram-transfer-text)]',
    sections: [
      { tables: ['InvTransfers', 'InvTransferItems', 'InvTransferItemUnits'] },
    ],
  },
  {
    title: '재고',
    prefix: 'Inventory*',
    cardClassName: 'border-[var(--diagram-inventory-stroke)] bg-[var(--diagram-inventory-fill)] ring-0',
    titleClassName: 'text-[var(--diagram-inventory-text)]',
    sections: [
      { label: '실물', tables: ['InventoryStocks', 'InventoryUnits'] },
      { label: '기준수량', tables: ['InventoryBaseQtyHistory'] },
      { label: '출고 전표', tables: ['InventoryIssues', 'InventoryIssueItems'] },
      { label: '입고 스캔', tables: ['InventoryScanSessions', 'InventoryScanEvents'] },
      { label: '실사', tables: ['InventoryAudits', 'InventoryAuditItems'] },
      { label: '입고 전표', tables: ['InventoryReceipts', 'InventoryReceiptItems'] },
    ],
  },
]

function TableGroupCard({ group }: { group: TableGroup }) {
  return (
    <Card
      aria-label={`${group.title} 테이블`}
      className={cn('border lg:min-h-60', group.cardClassName)}
      role="group"
      size="sm"
    >
      <CardHeader>
        <CardTitle className="flex items-baseline gap-2">
          <span className={group.titleClassName}>{group.title}</span>
          <code className="font-mono text-xs font-normal text-muted-foreground">
            {group.prefix}
          </code>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {group.sections.map((section, sectionIndex) => (
          <div
            key={section.label ?? sectionIndex}
            className={cn(
              'flex flex-col gap-1',
              section.label && 'grid grid-cols-[5.5rem_minmax(0,1fr)] gap-x-3'
            )}
          >
            {section.label ? (
              <span className="text-xs text-muted-foreground">{section.label}</span>
            ) : null}
            <div className={cn('flex flex-col gap-1', section.label && 'grid sm:grid-cols-2')}>
              {section.tables.map((table) => (
                <code key={table} className="font-mono text-xs text-foreground">
                  {table}
                </code>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function InventoryRelationshipOverview() {
  return (
    <section
      aria-label="테이블 구분과 관계"
      className="flex w-[min(90rem,calc(100vw-2rem))] self-center flex-col gap-5"
    >
      <h2 className="mt-8 text-2xl font-semibold tracking-tight">0. 테이블 관계</h2>
      <div className="grid gap-3 lg:grid-cols-[1fr_1fr_1.6fr]">
        {tableGroups.map((group) => <TableGroupCard key={group.title} group={group} />)}
      </div>
      <MermaidDiagram code={inventoryFlowDiagram} title="재고 입출고 테이블 관계" />
    </section>
  )
}
