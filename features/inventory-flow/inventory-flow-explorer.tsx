'use client'

import * as React from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'

import { inventoryFlows } from './inventory-flow.data'
import { buildInventorySnapshot } from './inventory-flow.reducer'
import { InventoryFlowTable } from './inventory-flow-table'
import type {
  InventoryScenarioBlock,
  InventorySnapshot,
  InventoryTableName,
} from './inventory-flow.types'

function ScenarioBlock({ block }: { block: InventoryScenarioBlock }) {
  if (block.type === 'heading') {
    return <h3 className="text-lg font-semibold">{block.text}</h3>
  }

  if (block.type === 'text') {
    return (
      <div className="space-y-1 rounded-lg bg-muted p-4 text-sm leading-6">
        {block.lines.map((line) => <p key={line}>{line}</p>)}
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {block.title ? <h4 className="font-semibold">{block.title}</h4> : null}
      <Table>
        <TableHeader>
          <TableRow>
            {block.columns.map((column) => <TableHead key={column}>{column}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {block.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {row.map((cell, cellIndex) => {
                const content = typeof cell === 'string' ? cell : cell.content
                const colSpan = typeof cell === 'string' ? undefined : cell.colSpan

                return (
                  <TableCell
                    key={`${cellIndex}-${content}`}
                    colSpan={colSpan}
                    className="whitespace-normal"
                  >
                    {content}
                  </TableCell>
                )
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function changeSummary(snapshot: InventorySnapshot, table: InventoryTableName): string {
  const changes = Object.values(snapshot.changes[table] ?? {})
  const inserts = changes.filter((change) => change.type === 'INSERT').length
  const updates = changes.length - inserts
  const parts = []

  if (inserts > 0) parts.push(`새 행 ${inserts}`)
  if (updates > 0) parts.push(`변경 ${updates}`)

  return parts.join(' · ')
}

export function InventoryFlowExplorer() {
  const [flowIndex, setFlowIndex] = React.useState(0)
  const [stepIndex, setStepIndex] = React.useState(0)
  const [reorderChanged, setReorderChanged] = React.useState(false)
  const [highlightedIdentifier, setHighlightedIdentifier] = React.useState<string>()
  const overviewRef = React.useRef<HTMLDivElement>(null)
  const flow = inventoryFlows[flowIndex]
  const step = flow.steps[stepIndex]
  const snapshot = React.useMemo(
    () => buildInventorySnapshot(flowIndex, stepIndex),
    [flowIndex, stepIndex]
  )
  const stepSnapshots = React.useMemo(
    () => flow.steps.map((_, index) => buildInventorySnapshot(flowIndex, index)),
    [flow, flowIndex]
  )

  function selectFlow(value: string) {
    setFlowIndex(Number(value))
    setStepIndex(0)
    setHighlightedIdentifier(undefined)
  }

  function selectStep(index: number) {
    setStepIndex(index)
    setHighlightedIdentifier(undefined)
  }

  function selectOverviewStep(index: number) {
    selectStep(index)
    overviewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function handleOverviewKeyDown(event: React.KeyboardEvent<HTMLTableRowElement>, index: number) {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      selectOverviewStep(index)
    }
  }

  function scrollToTable(table: InventoryTableName) {
    document.getElementById(`inventory-table-${table}`)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  return (
    <section className="my-8 space-y-6" aria-label="재고 입출고 흐름 탐색기">
      <Tabs value={String(flowIndex)} onValueChange={selectFlow}>
        <TabsList className="h-auto max-w-full flex-wrap justify-start" variant="line">
          {inventoryFlows.map((candidate, index) => (
            <TabsTrigger
              key={candidate.name}
              value={String(index)}
              onClick={() => selectFlow(String(index))}
              aria-label={index === 0 ? '일반 배송 흐름' : candidate.name}
              className="h-auto min-h-8 whitespace-normal px-3 py-2 text-left"
            >
              {candidate.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <p className="rounded-lg border-l-4 border-primary bg-secondary p-4 leading-7">
        {flow.description}
      </p>

      <div data-testid="inventory-scenario" className="space-y-4 rounded-xl border bg-card p-4">
        {flow.scenario.map((block, index) => (
          <ScenarioBlock key={`${block.type}-${index}`} block={block} />
        ))}
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {flow.steps.map((candidate, index) => (
          <Button
            key={`${candidate.no}-${candidate.name}`}
            type="button"
            variant={index === stepIndex ? 'default' : 'outline'}
            onClick={() => selectStep(index)}
            aria-label={`${candidate.no}단계 ${candidate.name}`}
            className="h-auto min-w-32 flex-col items-start py-3"
          >
            <span className="text-xs opacity-75">{candidate.no}단계</span>
            <span>{candidate.name}</span>
            {candidate.todo ? <Badge variant="destructive">미구현</Badge> : null}
          </Button>
        ))}
      </div>

      <div className="rounded-xl border bg-card p-5">
        <Badge variant="secondary">{step.actor}</Badge>
        <h3 className="mt-3 text-xl font-semibold">{step.name}</h3>
        <div className="mt-3 space-y-1 text-sm">
          <code className="block rounded bg-muted px-2 py-1">{step.api}</code>
          <code className="block rounded bg-muted px-2 py-1">{step.service}</code>
        </div>
        <p className="mt-4 leading-7">{step.description}</p>
        {step.derived ? (
          <div className="mt-4 rounded-lg bg-secondary p-4">
            <div className="mb-2 text-xs font-semibold text-secondary-foreground">
              이 시점의 파생값
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {step.derived.map(([label, value]) => (
                <span key={label} className="text-sm">
                  <b className="mr-2 text-muted-foreground">{label}</b>{value}
                </span>
              ))}
            </div>
          </div>
        ) : null}
        {step.todo ? (
          <div className="mt-4 rounded-lg bg-destructive/10 p-4 text-sm leading-6 text-destructive">
            <b className="mb-1 block">미구현</b>
            {step.todo}
          </div>
        ) : null}
      </div>

      {step.note ? (
        <aside className="rounded-lg bg-success/10 p-4 text-sm leading-6 text-success">
          {step.note}
        </aside>
      ) : null}

      <div ref={overviewRef} className="scroll-mt-20 rounded-xl border">
        <div className="border-b px-4 py-3 text-sm font-semibold">
          전체 흐름. 줄을 누르면 그 단계로 이동한다
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>단계</TableHead>
              <TableHead>누가</TableHead>
              <TableHead>바뀌는 테이블</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {flow.steps.map((candidate, index) => (
              <TableRow
                key={`${candidate.no}-${candidate.name}`}
                tabIndex={0}
                aria-label={`전체 흐름에서 ${candidate.no}. ${candidate.name} 선택. 담당자 ${candidate.actor}`}
                aria-selected={index === stepIndex}
                data-state={index === stepIndex ? 'selected' : undefined}
                onClick={() => selectOverviewStep(index)}
                onKeyDown={(event) => handleOverviewKeyDown(event, index)}
                className="cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <TableCell>
                  <span className="font-medium">
                    {candidate.no}. {candidate.name}
                    {candidate.todo ? <Badge variant="destructive" className="ml-2">미구현</Badge> : null}
                  </span>
                </TableCell>
                <TableCell>{candidate.actor}</TableCell>
                <TableCell className="whitespace-normal">
                  {stepSnapshots[index].changedTables.length === 0
                    ? <span className="text-muted-foreground">바뀌는 행 없음</span>
                    : stepSnapshots[index].changedTables.map((table) => (
                        <Badge key={table} variant="outline" className="mr-1 mb-1">
                          {table} {changeSummary(stepSnapshots[index], table)}
                        </Badge>
                      ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="rounded-xl border bg-card p-4">
        <div className="mb-3 text-sm font-semibold">
          {snapshot.changedTables.length > 0
            ? '이 단계에서 바뀐 테이블'
            : '이 단계에서는 아무 행도 만들어지거나 바뀌지 않는다.'}
        </div>
        <div className="flex flex-wrap gap-2">
          {snapshot.changedTables.map((table) => (
            <Button
              key={table}
              type="button"
              size="sm"
              variant="secondary"
              onClick={() => scrollToTable(table)}
            >
              {table} {changeSummary(snapshot, table)}
            </Button>
          ))}
        </div>
      </div>

      <label className="flex w-fit items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={reorderChanged}
          onChange={(event) => setReorderChanged(event.target.checked)}
          className="size-4 accent-primary"
        />
        바뀐 테이블을 맨 위로 모으기
      </label>

      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span><Badge variant="secondary">새 행</Badge> 이 단계에서 INSERT</span>
        <span><Badge variant="outline">변경</Badge> 이 단계에서 UPDATE</span>
        <span>회색 행은 이전 단계에서 만들어진 것</span>
        <span><Badge variant="destructive">미구현</Badge> 이 단계의 표는 구현 후 모습이다</span>
      </div>

      <InventoryFlowTable
        snapshot={snapshot}
        reorderChanged={reorderChanged}
        highlightedIdentifier={highlightedIdentifier}
        onIdentifierClick={(identifier) => setHighlightedIdentifier((current) => (
          current === identifier ? undefined : identifier
        ))}
      />
    </section>
  )
}
