'use client'

import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'

import { inventoryItemNames, inventorySchemas } from './inventory-flow.data'
import type {
  InventorySnapshot,
  InventoryTableName,
} from './inventory-flow.types'

interface InventoryFlowTableProps {
  snapshot: InventorySnapshot
  reorderChanged: boolean
  highlightedIdentifier?: string
  onIdentifierClick: (identifier: string) => void
}

const inventoryTableNames = Object.keys(inventorySchemas) as InventoryTableName[]

function countValues(snapshot: InventorySnapshot): Map<string, number> {
  const counts = new Map<string, number>()

  for (const table of inventoryTableNames) {
    const schema = inventorySchemas[table]
    for (const row of Object.values(snapshot.rows[table])) {
      for (const column of schema.columns) {
        const value = row[column]
        if (value && value !== 'null') {
          counts.set(value, (counts.get(value) ?? 0) + 1)
        }
      }
    }
  }

  return counts
}

function itemNameFor(row: Record<string, string>): string {
  const itemCode = row.item_cd
  return itemCode && itemCode in inventoryItemNames
    ? inventoryItemNames[itemCode as keyof typeof inventoryItemNames]
    : ''
}

export function InventoryFlowTable({
  snapshot,
  reorderChanged,
  highlightedIdentifier,
  onIdentifierClick,
}: InventoryFlowTableProps) {
  const valueCounts = React.useMemo(() => countValues(snapshot), [snapshot])
  const changedSet = new Set(snapshot.changedTables)
  const orderedTables = reorderChanged
    ? [
        ...inventoryTableNames.filter((table) => changedSet.has(table)),
        ...inventoryTableNames.filter((table) => !changedSet.has(table)),
      ]
    : inventoryTableNames

  let previousGroup: string | undefined
  let previousSection: string | undefined

  return (
    <div className="space-y-5">
      {orderedTables.map((table) => {
        const schema = inventorySchemas[table]
        const tableRows = Object.entries(snapshot.rows[table])
        const tableChanges = snapshot.changes[table]
        const showGroup = reorderChanged || schema.group !== previousGroup
        const showSection = !reorderChanged && Boolean(schema.section) && (
          schema.group !== previousGroup || schema.section !== previousSection
        )

        previousGroup = schema.group
        previousSection = schema.section

        return (
          <React.Fragment key={table}>
            {showGroup ? (
              <h3 className="mt-8 border-b pb-2 text-lg font-semibold">
                {schema.group}
              </h3>
            ) : null}
            {showSection ? (
              <h4 className="text-sm font-semibold text-muted-foreground">
                {schema.section}
              </h4>
            ) : null}
            <section
              id={`inventory-table-${table}`}
              data-testid="schema-table"
              className={cn(
                'scroll-mt-20 rounded-xl border bg-card',
                tableChanges && 'border-primary shadow-sm'
              )}
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b p-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-mono font-semibold">{table}</h4>
                    {reorderChanged ? <Badge variant="outline">{schema.group}</Badge> : null}
                    {tableChanges ? <Badge>변경</Badge> : null}
                  </div>
                  <p className="mt-1 text-sm leading-6 text-muted-foreground">{schema.role}</p>
                </div>
                <Badge variant="secondary">{tableRows.length}행</Badge>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    {schema.columns.map((column) => (
                      <TableHead key={column} className="font-mono text-xs">
                        {column}
                      </TableHead>
                    ))}
                    {schema.includeItemName ? (
                      <TableHead>품목명 (PrdItem 조인)</TableHead>
                    ) : null}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {tableRows.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={schema.columns.length + (schema.includeItemName ? 1 : 0)}
                        className="text-center text-muted-foreground"
                      >
                        아직 행이 없다
                      </TableCell>
                    </TableRow>
                  ) : tableRows.map(([identifier, row]) => {
                    const rowChange = tableChanges?.[identifier]
                    const isNew = rowChange?.type === 'INSERT'

                    return (
                      <TableRow key={identifier} className={cn(isNew && 'bg-success/10')}>
                        {schema.columns.map((column) => {
                          const value = row[column] ?? ''
                          const isChanged = !isNew && rowChange?.columns.includes(column)
                          const isSharedIdentifier = Boolean(value && (valueCounts.get(value) ?? 0) > 1)

                          return (
                            <TableCell
                              key={column}
                              className={cn(
                                'font-mono text-xs',
                                isChanged && 'bg-warning/20 text-warning'
                              )}
                            >
                              {isSharedIdentifier ? (
                                <button
                                  type="button"
                                  aria-pressed={highlightedIdentifier === value}
                                  onClick={() => onIdentifierClick(value)}
                                  className={cn(
                                    'rounded px-1 underline decoration-dotted underline-offset-2',
                                    highlightedIdentifier === value && 'bg-accent text-accent-foreground'
                                  )}
                                >
                                  {value}
                                </button>
                              ) : value}
                            </TableCell>
                          )
                        })}
                        {schema.includeItemName ? (
                          <TableCell className="text-xs text-muted-foreground">
                            {itemNameFor(row)}
                          </TableCell>
                        ) : null}
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </section>
          </React.Fragment>
        )
      })}
    </div>
  )
}
