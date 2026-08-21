export const inventoryFlowDiagram = `---
config:
  themeCSS: |
    .accent > rect { fill: var(--accent) !important; stroke: var(--accent-foreground) !important; }
    .success > rect { fill: var(--success-foreground) !important; stroke: var(--success) !important; }
    .warning > rect { fill: var(--warning-foreground) !important; stroke: var(--warning) !important; }
    .accent .label, .success .label, .warning .label { color: var(--foreground) !important; }
    .accent .label text, .success .label text, .warning .label text { fill: var(--foreground) !important; }
---
flowchart LR
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
  class FO,FOI accent
  class TR,TRI,TRU success
  class ST,UN,IS,ISI,RC,RCI,SS,SE,BQH warning`

export const inventoryHeaderItemDiagram = `---
config:
  themeCSS: |
    .success > rect { fill: var(--success-foreground) !important; stroke: var(--success) !important; }
    .warning > rect { fill: var(--warning-foreground) !important; stroke: var(--warning) !important; }
    .success .label, .warning .label { color: var(--foreground) !important; }
    .success .label text, .warning .label text { fill: var(--foreground) !important; }
---
flowchart LR
  IS["InventoryIssues
전표 1행"] -->|"1 : N"| ISI["InventoryIssueItems
품목 N행"]
  RC["InventoryReceipts
전표 1행"] -->|"1 : N"| RCI["InventoryReceiptItems
품목 N행"]
  TR["InvTransfers
이동 1행"] -->|"1 : N"| TRI["InvTransferItems
품목 N행"]
  AU["InventoryAudits
실사 1행"] -->|"1 : N"| AUI["InventoryAuditItems
품목 N행"]
  class TR,TRI success
  class IS,ISI,RC,RCI,AU,AUI warning`

export const inventoryTransferBoundaryDiagram = `---
config:
  themeCSS: |
    .success > rect { fill: var(--success-foreground) !important; stroke: var(--success) !important; }
    .warning > rect { fill: var(--warning-foreground) !important; stroke: var(--warning) !important; }
    .success .label, .warning .label { color: var(--foreground) !important; }
    .success .label text, .warning .label text { fill: var(--foreground) !important; }
    .cluster rect { fill: var(--card) !important; stroke: var(--border) !important; }
    .cluster-label text, .cluster-label span { fill: var(--foreground) !important; color: var(--foreground) !important; }
---
flowchart TD
  TR["InvTransfers
이동 지시"] -->|"issue_id"| IS
  TR -->|"receipt_id"| RC
  subgraph SE["서울지점"]
    RC["InventoryReceipts
하차 때 생성"]
  end
  subgraph BS["부산지점"]
    IS["InventoryIssues
상차 때 생성"]
  end
  class TR success
  class IS,RC warning`

export const consignmentFeeDiagram = `flowchart LR
  A[기본 탁송비] --> B[수량 확인]
  B --> C[추가 탁송비 계산]
  C --> D[총 탁송비]`

export const deliveryFeeLookupDiagram = `flowchart LR
  Company["하차 본부 legacyBpCode"] --> Zone["BP_CD + REGION_CD → DLVY_ZONE1"]
  Destination["발주 dlvyCd"] --> Region["REGION_CD"]
  Region --> Zone
  Zone --> Rates["A01 구역 단가"]
  Fixed["C03ㆍC04 고정 1구역"] --> Rates
  Rates --> Fee["하차 배송비"]`

export const diagrams = {
  inventoryFlowDiagram,
  inventoryHeaderItemDiagram,
  inventoryTransferBoundaryDiagram,
  consignmentFeeDiagram,
  deliveryFeeLookupDiagram,
} as const
