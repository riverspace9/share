import { inventoryFlows } from '@/features/inventory-flow/inventory-flow.data'
import { buildInventorySnapshot } from '@/features/inventory-flow/inventory-flow.reducer'

describe('재고 입출고 누적 계산', () => {
  it('선택 단계까지의 삽입과 수정을 순서대로 적용한다', () => {
    const snapshot = buildInventorySnapshot(0, 3)

    expect(snapshot.rows.InventoryStocks['ST-1'].qty).toBe('3')
    expect(snapshot.rows.InventoryStocks['ST-2']).toMatchObject({
      qty: '7',
      reserved_qty: '0',
    })
    expect(snapshot.changedTables).toContain('InventoryIssues')
    expect(snapshot.changedIdentifiers).toContain('ISS-1')
  })

  it('변경 표시는 선택한 현재 단계의 작업만 포함한다', () => {
    const snapshot = buildInventorySnapshot(0, 4)

    expect(snapshot.changedTables).toEqual(['FevFlowerOrders'])
    expect(snapshot.changes.FevFlowerOrders?.['FO-1']).toEqual({
      type: 'UPDATE',
      columns: ['order_status'],
    })
  })

  it('원본 기본 행과 작업 데이터를 변경하지 않는다', () => {
    const baseBefore = structuredClone(inventoryFlows[0].base)
    const stepsBefore = structuredClone(inventoryFlows[0].steps)

    buildInventorySnapshot(0, 3)

    expect(inventoryFlows[0].base).toEqual(baseBefore)
    expect(inventoryFlows[0].steps).toEqual(stepsBefore)
  })
})
