import { inventoryFlows, inventorySchemas } from './inventory-flow.data'
import type {
  InventoryRow,
  InventoryRowChange,
  InventorySnapshot,
  InventoryTableName,
} from './inventory-flow.types'

const inventoryTableNames = Object.keys(inventorySchemas) as InventoryTableName[]

function createEmptyRows(): InventorySnapshot['rows'] {
  return Object.fromEntries(
    inventoryTableNames.map((table) => [table, {}])
  ) as InventorySnapshot['rows']
}

function mergeChange(
  current: InventoryRowChange | undefined,
  type: InventoryRowChange['type'],
  columns: readonly string[]
): InventoryRowChange {
  return {
    type: current?.type === 'INSERT' ? 'INSERT' : type,
    columns: [...new Set([...(current?.columns ?? []), ...columns])],
  }
}

export function buildInventorySnapshot(
  flowIndex: number,
  stepIndex: number
): InventorySnapshot {
  const flow = inventoryFlows[flowIndex]
  const rows = createEmptyRows()
  const changes: InventorySnapshot['changes'] = {}
  const changedTableSet = new Set<InventoryTableName>()
  const changedIdentifierSet = new Set<string>()

  for (const [table, identifier, values] of flow.base) {
    rows[table][identifier] = { ...values }
  }

  for (let currentStepIndex = 0; currentStepIndex <= stepIndex; currentStepIndex += 1) {
    const step = flow.steps[currentStepIndex]

    for (const operation of step.operations) {
      const tableRows = rows[operation.table]
      const existingRow = tableRows[operation.identifier]

      if (operation.type === 'INSERT') {
        if (!existingRow) {
          tableRows[operation.identifier] = { ...operation.values }
        }
      } else if (existingRow) {
        tableRows[operation.identifier] = {
          ...existingRow,
          ...operation.values,
        } satisfies InventoryRow
      }

      if (currentStepIndex === stepIndex) {
        const tableChanges = (changes[operation.table] ??= {})
        tableChanges[operation.identifier] = mergeChange(
          tableChanges[operation.identifier],
          operation.type,
          Object.keys(operation.values)
        )
        changedTableSet.add(operation.table)
        changedIdentifierSet.add(operation.identifier)
      }
    }
  }

  return {
    rows,
    changes,
    changedTables: inventoryTableNames.filter((table) => changedTableSet.has(table)),
    changedIdentifiers: [...changedIdentifierSet],
  }
}
