import {
  inventoryFlows,
  inventoryItemNames,
  inventorySchemas,
} from '@/features/inventory-flow/inventory-flow.data'
import { inventoryFlowDiagram } from '@/content/diagrams'

function normalizeMermaid(source: string): string {
  return source
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .trim()
}

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

  it('비교표의 공통 값 네 행을 두 열 병합으로 유지한다', () => {
    const logisticsComparison = inventoryFlows[2].scenario.find(
      (block) => block.type === 'table' && block.title === '지금 동작과의 차이'
    )
    const flagComparison = inventoryFlows[4].scenario.find(
      (block) => block.type === 'table' && block.title === '조사용품과의 차이'
    )

    expect(logisticsComparison).toMatchObject({
      rows: expect.arrayContaining([
        ['유닛이 생기는 시점', { content: '같다. 지점이 찍고 입고를 완료할 때', colSpan: 2 }],
        ['화면', { content: '같다. 입고 스캔 세션 하나를 쓴다', colSpan: 2 }],
      ]),
    })
    expect(flagComparison).toMatchObject({
      rows: expect.arrayContaining([
        ['현재고', { content: '같다. InventoryStocks.qty', colSpan: 2 }],
        ['가용재고', { content: '같다. qty - reserved_qty', colSpan: 2 }],
      ]),
    })
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

  it('수동 대조한 typed migration 전체를 보존한다', () => {
    expect({
      schemas: inventorySchemas,
      itemNames: inventoryItemNames,
      flows: inventoryFlows,
    }).toMatchSnapshot()
  })

  it('수동 대조한 Mermaid 노드, 연결, 그룹, 스타일을 보존한다', () => {
    expect(normalizeMermaid(inventoryFlowDiagram)).toMatchSnapshot()
  })
})
