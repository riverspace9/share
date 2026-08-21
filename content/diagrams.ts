export const inventoryFlowDiagram = `flowchart LR
  A[입고 요청] --> B[재고 반영]
  B --> C[출고 요청]
  C --> D[재고 차감]`

export const consignmentFeeDiagram = `flowchart LR
  A[기본 탁송비] --> B[수량 확인]
  B --> C[추가 탁송비 계산]
  C --> D[총 탁송비]`

export const diagrams = {
  inventoryFlowDiagram,
  consignmentFeeDiagram,
} as const
