export const inventoryFlowDiagram = `flowchart LR
  FO["FevFlowerOrders
화환 주문"]
  FOI["FevFlowerOrderItems
주문 품목"]
  TR["InvTransfers
이동 지시서"]
  TRI["InvTransferItems
이동 품목"]
  TRU["InvTransferItemUnits
품목과 바코드 연결"]
  ST["InventoryStocks
회사·품목별 보유 수량"]
  UN["InventoryUnits
조사용품 낱개"]
  IS["InventoryIssues
출고 전표"]
  ISI["InventoryIssueItems
출고 품목"]
  BQH["InventoryBaseQtyHistory
기준수량 변경 이력"]
  SS["InventoryScanSessions
입고 QR 스캔 세션"]
  SE["InventoryScanEvents
스캔 1건"]
  RC["InventoryReceipts
입고 전표"]
  RCI["InventoryReceiptItems
입고 품목"]
  FO -->|"1 : N"| FOI
  TR -->|"1 : N"| TRI
  TRI -->|"1 : N"| TRU
  IS -->|"1 : N"| ISI
  ST -->|"1 : N"| BQH
  RC -->|"1 : N"| RCI
  FO -->|"inventory_transfer_id"| TR
  FOI -->|"inventory_stock_id"| ST
  TR -->|"issue_id"| IS
  TR -->|"receipt_id"| RC
  TRU -->|"inventory_unit_id"| UN
  SS -->|"1 : N"| SE
  SS -->|"receipt_id"| RC
  UN -->|"last_issue_id"| IS
  classDef p fill:#EEEDFE,stroke:#7F77DD,stroke-width:1.5px,color:#26215C
  classDef t fill:#E1F5EE,stroke:#1D9E75,stroke-width:1.5px,color:#04342C
  classDef i fill:#FAECE7,stroke:#D85A30,stroke-width:1.5px,color:#4A1B0C
  class FO,FOI p
  class TR,TRI,TRU t
  class ST,UN,IS,ISI,RC,RCI,SS,SE,BQH i`

export const consignmentFeeDiagram = `flowchart LR
  A[기본 탁송비] --> B[수량 확인]
  B --> C[추가 탁송비 계산]
  C --> D[총 탁송비]`

export const diagrams = {
  inventoryFlowDiagram,
  consignmentFeeDiagram,
} as const
