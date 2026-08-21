export type InventoryTableName =
  | 'FevFlowerOrders'
  | 'FevFlowerOrderItems'
  | 'InvTransfers'
  | 'InvTransferItems'
  | 'InvTransferItemUnits'
  | 'InventoryStocks'
  | 'InventoryUnits'
  | 'InventoryBaseQtyHistory'
  | 'InventoryIssues'
  | 'InventoryIssueItems'
  | 'InventoryScanSessions'
  | 'InventoryScanEvents'
  | 'InventoryAudits'
  | 'InventoryAuditItems'
  | 'InventoryReceipts'
  | 'InventoryReceiptItems'

export type InventoryGroup = '플라워' | '재고 이관' | '재고'
export type InventoryRow = Record<string, string>

export interface InventorySchemaDefinition {
  group: InventoryGroup
  section?: string
  includeItemName?: boolean
  role: string
  columns: readonly string[]
}

export type InventoryBaseRow = readonly [
  table: InventoryTableName,
  identifier: string,
  values: InventoryRow,
]

export interface InventoryOperation {
  table: InventoryTableName
  identifier: string
  type: 'INSERT' | 'UPDATE'
  values: InventoryRow
}

export interface InventoryScenarioHeading {
  type: 'heading'
  text: string
}

export interface InventoryScenarioText {
  type: 'text'
  lines: readonly string[]
}

export interface InventoryScenarioTable {
  type: 'table'
  title?: string
  columns: readonly string[]
  rows: readonly (readonly string[])[]
}

export type InventoryScenarioBlock =
  | InventoryScenarioHeading
  | InventoryScenarioText
  | InventoryScenarioTable

export interface InventoryFlowStep {
  no: string
  name: string
  actor: string
  api: string
  service: string
  description: string
  note?: string
  todo?: string
  derived?: readonly (readonly [label: string, value: string])[]
  operations: readonly InventoryOperation[]
}

export interface InventoryFlowDefinition {
  name: string
  description: string
  scenario: readonly InventoryScenarioBlock[]
  base: readonly InventoryBaseRow[]
  steps: readonly InventoryFlowStep[]
}

export interface InventoryRowChange {
  type: 'INSERT' | 'UPDATE'
  columns: readonly string[]
}

export interface InventorySnapshot {
  rows: Record<InventoryTableName, Record<string, InventoryRow>>
  changes: Partial<Record<InventoryTableName, Record<string, InventoryRowChange>>>
  changedTables: InventoryTableName[]
  changedIdentifiers: string[]
}
