import { inventoryFlows, inventorySchemas } from '@/features/inventory-flow/inventory-flow.data'
import { inventoryFlowDiagram } from '@/content/diagrams'

describe('재고 입출고 원본 보존 계약', () => {
  it('16개 스키마를 유지한다', () => {
    expect(Object.keys(inventorySchemas)).toHaveLength(16)
  })

  it('다섯 흐름의 이름과 단계 수를 유지한다', () => {
    expect(inventoryFlows.map((flow) => flow.name)).toEqual([
      '비탁송 (일반 배송)',
      '탁송 (부산지점 → 서울지점 → 장례식장)',
      '물류센터 입고',
      '재고 실사 (조사용품)',
      '근조기ㆍ축기 (수량 재고)',
    ])
    expect(inventoryFlows.map((flow) => flow.steps.length)).toEqual([5, 7, 4, 3, 5])
  })

  it('각 흐름에서 미구현 단계 수를 유지한다', () => {
    expect(
      inventoryFlows.map((flow) => flow.steps.filter((step) => step.todo).length)
    ).toEqual([4, 3, 3, 0, 3])
  })

  it('관계도에 원본의 연결 대상 스키마를 모두 표시한다', () => {
    const relationshipTables = [
      'FevFlowerOrders',
      'FevFlowerOrderItems',
      'InvTransfers',
      'InvTransferItems',
      'InvTransferItemUnits',
      'InventoryStocks',
      'InventoryUnits',
      'InventoryBaseQtyHistory',
      'InventoryIssues',
      'InventoryIssueItems',
      'InventoryScanSessions',
      'InventoryScanEvents',
      'InventoryReceipts',
      'InventoryReceiptItems',
    ]

    for (const table of relationshipTables) {
      expect(inventoryFlowDiagram).toContain(table)
    }
  })
})
