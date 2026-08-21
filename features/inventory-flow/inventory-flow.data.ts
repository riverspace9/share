import type {
  InventoryFlowDefinition,
  InventorySchemaDefinition,
  InventoryTableName,
} from './inventory-flow.types'

export const inventorySchemas: Record<InventoryTableName, InventorySchemaDefinition> = {
  "FevFlowerOrders": {
    "group": "플라워",
    "role": "플라워 지점의 주문 1건. 화환도 여기 담기지만 모든 주문이 화환은 아니다. 탁송이면 출발 지점 주문과 도착 지점 주문 두 건이 생긴다",
    "columns": [
      "order_id",
      "order_no",
      "company_id",
      "consignment_type",
      "order_status",
      "inventory_transfer_id"
    ]
  },
  "FevFlowerOrderItems": {
    "group": "플라워",
    "role": "주문 품목. 발주 라인을 스냅샷으로 복사하고 어느 재고 행에서 나갈지 가리킨다 (재고 무관 컬럼 15개는 생략)",
    "columns": [
      "flower_order_item_id",
      "flower_order_id",
      "line_no_snapshot",
      "item_code_snapshot",
      "item_name_snapshot",
      "unit_snapshot",
      "quantity_snapshot",
      "inventory_stock_id"
    ]
  },
  "InvTransfers": {
    "group": "재고 이관",
    "role": "재고이동 지시서. 탁송과 자사 배송을 한 자료구조로 담는다. erp_doc_no 는 ERP 연동 안에서만 쓰는 컬럼이다",
    "columns": [
      "transfer_id",
      "transfer_type",
      "source_company_id",
      "destination_company_id",
      "status",
      "issue_id",
      "receipt_id",
      "erp_doc_no"
    ]
  },
  "InvTransferItems": {
    "group": "재고 이관",
    "includeItemName": true,
    "role": "이동 품목. 재고유형이 품목마다 붙어 한 이동에 유형이 섞일 수 있다",
    "columns": [
      "transfer_item_id",
      "transfer_id",
      "item_cd",
      "inventory_type",
      "requested_qty"
    ]
  },
  "InvTransferItemUnits": {
    "group": "재고 이관",
    "role": "이동 품목과 실물 바코드를 연결한다. 조사용품만 해당한다",
    "columns": [
      "id",
      "transfer_item_id",
      "inventory_unit_id",
      "unloaded_at"
    ]
  },
  "InventoryStocks": {
    "group": "재고",
    "section": "실물 재고 (수량과 낱개)",
    "includeItemName": true,
    "role": "회사·품목별 재고 1행. 현재고는 재고유형과 무관하게 qty 이고 가용재고는 qty - reserved_qty 다. base_qty 는 근조기·축기가 몇 개 있어야 하는지를 정한 목표치이고 현재고 계산에 들어가지 않는다",
    "columns": [
      "stock_id",
      "company_id",
      "item_cd",
      "inventory_type",
      "qty",
      "reserved_qty",
      "base_qty"
    ]
  },
  "InventoryUnits": {
    "group": "재고",
    "section": "실물 재고 (수량과 낱개)",
    "includeItemName": true,
    "role": "조사용품 실물 한 개. 바코드로 어느 낱개가 어디 있는지를 추적한다. 수량 자체는 InventoryStocks.qty 가 갖고 이 행은 그 안의 개별 실물을 가리킨다. 근조기·축기는 이 행이 없다",
    "columns": [
      "unit_id",
      "barcode",
      "company_id",
      "item_cd",
      "inventory_type",
      "status",
      "last_issue_id"
    ]
  },
  "InventoryBaseQtyHistory": {
    "group": "재고",
    "section": "기준수량",
    "includeItemName": true,
    "role": "근조기·축기 기준수량(base_qty) 변경 이력. 목표치를 누가 언제 얼마로 바꿨는지 남긴다. 본사 관리자가 편집할 때만 쌓인다",
    "columns": [
      "base_qty_history_id",
      "inventory_stock_id",
      "item_cd",
      "old_qty",
      "new_qty",
      "reason"
    ]
  },
  "InventoryIssues": {
    "group": "재고",
    "section": "출고 전표",
    "role": "출고 전표. 회사에서 재고가 나간 사실을 기록한다",
    "columns": [
      "issue_id",
      "company_id",
      "issue_type",
      "status",
      "issued_at"
    ]
  },
  "InventoryIssueItems": {
    "group": "재고",
    "section": "출고 전표",
    "includeItemName": true,
    "role": "출고 품목. 사용수량은 CONSUME 전표의 이 행을 합산한다",
    "columns": [
      "issue_item_id",
      "issue_id",
      "item_cd",
      "inventory_type",
      "qty"
    ]
  },
  "InventoryScanSessions": {
    "group": "재고",
    "section": "입고 스캔",
    "role": "QR 스캔 화면의 세션. session_type 이 RECEIVING(입고)과 AUDIT(실사) 두 가지다. 조사용품 전용이며, 입고 완료 시 스캔한 품목이 걸린 운송중 재고이동도 함께 수령 처리한다",
    "columns": [
      "scan_session_id",
      "session_type",
      "company_id",
      "inventory_type",
      "status",
      "receipt_id"
    ]
  },
  "InventoryScanEvents": {
    "group": "재고",
    "section": "입고 스캔",
    "includeItemName": true,
    "role": "스캔 1건. 완료 전까지 여기에만 쌓이고 재고에는 반영되지 않는다. result_code 는 NORMAL·EXCESS·UNPLANNED·UNKNOWN_ITEM·DUPLICATE 다",
    "columns": [
      "scan_event_id",
      "scan_session_id",
      "barcode",
      "item_cd",
      "result_code",
      "voided"
    ]
  },
  "InventoryAudits": {
    "group": "재고",
    "section": "실사",
    "role": "재고 실사 1건. 시작 시점의 재고 수량을 장부 수량으로 복사한다",
    "columns": [
      "inventory_audit_id",
      "company_id",
      "inventory_type",
      "status",
      "audit_dt"
    ]
  },
  "InventoryAuditItems": {
    "group": "재고",
    "section": "실사",
    "includeItemName": true,
    "role": "실사 품목. book_qty 는 시작 시점의 InventoryStocks.qty 복사본이고, actual_qty 는 찍거나 입력한 수, diff_qty 는 그 차이다",
    "columns": [
      "inventory_audit_item_id",
      "inventory_audit_id",
      "item_cd",
      "book_qty",
      "actual_qty",
      "diff_qty"
    ]
  },
  "InventoryReceipts": {
    "group": "재고",
    "section": "입고 전표",
    "role": "입고 전표. 회사로 재고가 들어온 사실을 기록한다",
    "columns": [
      "receipt_id",
      "company_id",
      "receipt_type",
      "status",
      "receipt_dt"
    ]
  },
  "InventoryReceiptItems": {
    "group": "재고",
    "section": "입고 전표",
    "includeItemName": true,
    "role": "입고 품목. 근조기·축기 반납 합산은 완료된 입고 전표를 유형과 무관하게 전부 차감한다",
    "columns": [
      "receipt_item_id",
      "receipt_id",
      "item_cd",
      "inventory_type",
      "qty",
      "barcode"
    ]
  }
}

export const inventoryItemNames = {
  "A0100010": "[조사용품] 현진시닝(300인분)",
  "B0201001": "근조기",
  "C0310220": "[근조기]LG전자"
} as const

export const inventoryFlows: readonly InventoryFlowDefinition[] = [
  {
    "name": "비탁송 (일반 배송)",
    "description": "서울지점이 자기 재고로 장례식장에 배송한다. 재고가 바뀌는 시점은 출고 한 번뿐이다.",
    "scenario": [
      {
        "type": "heading",
        "text": "주문 내용"
      },
      {
        "type": "text",
        "lines": [
          "현진웹 발주번호 PO-2026-0001",
          "배송 경로 서울지점 → OO장례식장",
          "서울지점이 자기 재고로 바로 배송한다. 재고이동은 자사 배송(DELIVERY)으로 만들어지고 도착사가 없다."
        ]
      },
      {
        "type": "table",
        "columns": [
          "품목코드",
          "품목명",
          "재고유형",
          "단위",
          "수량",
          "재고 추적"
        ],
        "rows": [
          [
            "A0100010",
            "[조사용품] 현진시닝(300인분)",
            "FUNERAL_SUPPLIES",
            "BOX",
            "2",
            "바코드 낱개 (BC-1001, BC-1002)"
          ],
          [
            "B0201001",
            "근조기",
            "CONDOLENCE_FLAG",
            "EA",
            "3",
            "수량만. 현재고는 기준수량에서 사용수량을 뺀 값이다"
          ]
        ]
      }
    ],
    "base": [
      [
        "InventoryStocks",
        "ST-1",
        {
          "stock_id": "ST-1",
          "company_id": "서울지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "qty": "5",
          "reserved_qty": "0",
          "base_qty": "null"
        }
      ],
      [
        "InventoryStocks",
        "ST-2",
        {
          "stock_id": "ST-2",
          "company_id": "서울지점",
          "item_cd": "B0201001",
          "inventory_type": "CONDOLENCE_FLAG",
          "qty": "10",
          "reserved_qty": "0",
          "base_qty": "10"
        }
      ],
      [
        "InventoryUnits",
        "U-1",
        {
          "unit_id": "U-1",
          "barcode": "BC-1001",
          "company_id": "서울지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "status": "IN_STOCK",
          "last_issue_id": "null"
        }
      ],
      [
        "InventoryUnits",
        "U-2",
        {
          "unit_id": "U-2",
          "barcode": "BC-1002",
          "company_id": "서울지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "status": "IN_STOCK",
          "last_issue_id": "null"
        }
      ]
    ],
    "steps": [
      {
        "no": "1",
        "name": "발주 확정 접수",
        "actor": "현진웹 (행사관리)",
        "api": "POST /v1/fsms/partners/flower/hjw-orders",
        "service": "FlowerOrdersService.create",
        "description": "현진웹에서 발주가 확정되면 FSMS로 넘어온다. 주문 1건과 함께 자사 배송 이동(DELIVERY)이 만들어진다. 수량 예약은 다음 단계다.",
        "note": "비탁송도 InvTransfers 행을 만드는 것이 이 설계의 핵심이다. 자료구조를 탁송과 하나로 맞춰야 뒤 단계 코드가 같아진다.",
        "todo": "Task 7. 지금은 비탁송 주문이 InvTransfers 행을 만들지 않는다. createTransferInTransaction 호출이 탁송 분기 안에만 있다(flower-orders.service.ts:1116).",
        "operations": [
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-1",
            "type": "INSERT",
            "values": {
              "order_id": "FO-1",
              "order_no": "PO-2026-0001",
              "company_id": "서울지점",
              "consignment_type": "null",
              "order_status": "ORDERED",
              "inventory_transfer_id": "TR-1"
            }
          },
          {
            "table": "FevFlowerOrderItems",
            "identifier": "FOI-1",
            "type": "INSERT",
            "values": {
              "flower_order_item_id": "FOI-1",
              "flower_order_id": "FO-1",
              "line_no_snapshot": "1",
              "item_code_snapshot": "A0100010",
              "item_name_snapshot": "[조사용품] 현진시닝(300인분)",
              "unit_snapshot": "BOX",
              "quantity_snapshot": "2",
              "inventory_stock_id": "ST-1"
            }
          },
          {
            "table": "FevFlowerOrderItems",
            "identifier": "FOI-2",
            "type": "INSERT",
            "values": {
              "flower_order_item_id": "FOI-2",
              "flower_order_id": "FO-1",
              "line_no_snapshot": "2",
              "item_code_snapshot": "B0201001",
              "item_name_snapshot": "근조기",
              "unit_snapshot": "EA",
              "quantity_snapshot": "3",
              "inventory_stock_id": "ST-2"
            }
          },
          {
            "table": "InvTransfers",
            "identifier": "TR-1",
            "type": "INSERT",
            "values": {
              "transfer_id": "TR-1",
              "transfer_type": "DELIVERY",
              "source_company_id": "서울지점",
              "destination_company_id": "null",
              "status": "PREPARING",
              "issue_id": "null",
              "receipt_id": "null"
            }
          },
          {
            "table": "InvTransferItems",
            "identifier": "TI-1",
            "type": "INSERT",
            "values": {
              "transfer_item_id": "TI-1",
              "transfer_id": "TR-1",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "requested_qty": "2"
            }
          },
          {
            "table": "InvTransferItems",
            "identifier": "TI-2",
            "type": "INSERT",
            "values": {
              "transfer_item_id": "TI-2",
              "transfer_id": "TR-1",
              "item_cd": "B0201001",
              "inventory_type": "CONDOLENCE_FLAG",
              "requested_qty": "3"
            }
          }
        ]
      },
      {
        "no": "2",
        "name": "상품 준비",
        "actor": "협력사 담당자",
        "api": "POST /v1/fsms/partners/flower/orders/:id/confirm",
        "service": "FlowerOrdersService.confirm",
        "description": "주문 상태가 바뀌고 근조기 수량이 예약된다. qty 는 그대로이고 reserved_qty 만 오른다. 가용재고는 qty - reserved_qty 다.",
        "note": "수량 단위로 예약하는 것은 근조기ㆍ축기다. 조사용품은 이 단계를 건너뛰고 3단계에서 바코드 낱개마다 예약된다(inventory-transfer.service.ts:111). 예약은 qty - reserved_qty >= 요청수량 일 때만 통과한다(:931).",
        "todo": "Task 7. 지금은 비탁송 confirm 이 주문 상태만 바꾸고 수량 예약이 없다. 근조기 재고 행은 qty 가 0인 경우가 많아, 예약이 붙으면 그대로는 통과하지 않는다. 현재고를 qty 로 통일하는 작업이 선행되어야 한다.",
        "operations": [
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-1",
            "type": "UPDATE",
            "values": {
              "order_status": "CONFIRMED"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-2",
            "type": "UPDATE",
            "values": {
              "reserved_qty": "3"
            }
          }
        ]
      },
      {
        "no": "3",
        "name": "품목 확인 QR",
        "actor": "협력사 담당자",
        "api": "POST /v1/fsms/partners/flower/orders/:id/item-verifications",
        "service": "FlowerOrdersService.verifyItems",
        "description": "조사용품 바코드를 스캔해 어느 실물 유닛을 내보낼지 정한다. 조사용품도 수량은 InventoryStocks에 있고, 이 단계는 그중 어느 낱개인지를 정하는 것이다. 근조기는 유닛 행이 없어 이 단계를 거치지 않는다.",
        "todo": "Task 8. 지금은 비탁송이 InvTransferItemUnits 가 아니라 FevFlowerOrderItemUnits 에 기록한다. 수량 예약도 이 시점에 바코드마다 1씩 걸린다(inventory-unit.service.ts:68).",
        "operations": [
          {
            "table": "InvTransferItemUnits",
            "identifier": "TU-1",
            "type": "INSERT",
            "values": {
              "id": "TU-1",
              "transfer_item_id": "TI-1",
              "inventory_unit_id": "U-1",
              "unloaded_at": "null"
            }
          },
          {
            "table": "InvTransferItemUnits",
            "identifier": "TU-2",
            "type": "INSERT",
            "values": {
              "id": "TU-2",
              "transfer_item_id": "TI-1",
              "inventory_unit_id": "U-2",
              "unloaded_at": "null"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-1",
            "type": "UPDATE",
            "values": {
              "status": "RESERVED"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-2",
            "type": "UPDATE",
            "values": {
              "status": "RESERVED"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-1",
            "type": "UPDATE",
            "values": {
              "reserved_qty": "2"
            }
          }
        ]
      },
      {
        "no": "4",
        "name": "상품 출고",
        "actor": "협력사 담당자",
        "api": "POST /v1/fsms/partners/flower/orders/:id/ship",
        "service": "FlowerOrdersService.ship",
        "description": "회사에서 재고가 나간다. 출고 전표를 남긴다. 외부로 나가는 것이므로 issue_type은 CONSUME이다.",
        "note": "전표 한 건이 조사용품 품목과 근조기 품목을 함께 담는다. 재고유형은 전표 헤더가 아니라 품목 행이 갖는다. 두 유형 모두 qty 가 줄고 예약이 풀린다. 근조기는 여기에 더해 이 CONSUME 전표가 사용수량 3을 만든다.",
        "todo": "Task 9. 지금은 출고 전표를 만들지 않는다. 조사용품 유닛만 CONSUMED 로 옮기고 수량을 1씩 뺀다. 근조기·축기는 아무 처리도 일어나지 않아 나간 사실이 어디에도 남지 않는다.",
        "derived": [
          [
            "근조기 현재고(qty)",
            "10 → 7"
          ],
          [
            "근조기 기준수량",
            "10"
          ],
          [
            "근조기 사용수량",
            "0 → 3"
          ]
        ],
        "operations": [
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-1",
            "type": "UPDATE",
            "values": {
              "order_status": "DELIVERING"
            }
          },
          {
            "table": "InventoryIssues",
            "identifier": "ISS-1",
            "type": "INSERT",
            "values": {
              "issue_id": "ISS-1",
              "company_id": "서울지점",
              "issue_type": "CONSUME",
              "status": "COMPLETED",
              "issued_at": "2026-08-20 10:12"
            }
          },
          {
            "table": "InventoryIssueItems",
            "identifier": "II-1",
            "type": "INSERT",
            "values": {
              "issue_item_id": "II-1",
              "issue_id": "ISS-1",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "qty": "2"
            }
          },
          {
            "table": "InventoryIssueItems",
            "identifier": "II-2",
            "type": "INSERT",
            "values": {
              "issue_item_id": "II-2",
              "issue_id": "ISS-1",
              "item_cd": "B0201001",
              "inventory_type": "CONDOLENCE_FLAG",
              "qty": "3"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-1",
            "type": "UPDATE",
            "values": {
              "status": "CONSUMED",
              "last_issue_id": "ISS-1"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-2",
            "type": "UPDATE",
            "values": {
              "status": "CONSUMED",
              "last_issue_id": "ISS-1"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-2",
            "type": "UPDATE",
            "values": {
              "qty": "7",
              "reserved_qty": "0"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-1",
            "type": "UPDATE",
            "values": {
              "qty": "3",
              "reserved_qty": "0"
            }
          }
        ]
      },
      {
        "no": "5",
        "name": "배송 완료",
        "actor": "협력사 담당자",
        "api": "POST /v1/fsms/partners/flower/orders/:id/deliver",
        "service": "FlowerOrdersService.deliver",
        "description": "상태 전이만 일어난다. 재고 차감은 4단계에서 끝났다.",
        "operations": [
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-1",
            "type": "UPDATE",
            "values": {
              "order_status": "DELIVERED"
            }
          }
        ]
      }
    ]
  },
  {
    "name": "탁송 (부산지점 → 서울지점 → 장례식장)",
    "description": "출발 지점에서 도착 지점으로 보낸 뒤, 도착 지점이 장례식장에 배송한다. 재고가 바뀌는 시점이 셋이다. 출고(상차) → 입고(하차) → 출고(배송).",
    "scenario": [
      {
        "type": "heading",
        "text": "주문 내용"
      },
      {
        "type": "text",
        "lines": [
          "현진웹 발주번호 PO-2026-0002",
          "배송 경로 부산지점 → 서울지점 → OO장례식장",
          "서울지점에 재고가 없어 부산지점에서 보낸다. 재고이동은 지점 간 이동(TRANSFER)이고 도착사가 서울지점이다."
        ]
      },
      {
        "type": "table",
        "columns": [
          "품목코드",
          "품목명",
          "재고유형",
          "단위",
          "수량",
          "재고 추적"
        ],
        "rows": [
          [
            "A0100010",
            "[조사용품] 현진시닝(300인분)",
            "FUNERAL_SUPPLIES",
            "BOX",
            "2",
            "바코드 낱개 (BC-1001, BC-1002)"
          ],
          [
            "B0201001",
            "근조기",
            "CONDOLENCE_FLAG",
            "EA",
            "3",
            "수량만. 현재고는 기준수량에서 사용수량을 뺀 값이다"
          ]
        ]
      }
    ],
    "base": [
      [
        "InventoryStocks",
        "ST-1",
        {
          "stock_id": "ST-1",
          "company_id": "부산지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "qty": "5",
          "reserved_qty": "0",
          "base_qty": "null"
        }
      ],
      [
        "InventoryStocks",
        "ST-2",
        {
          "stock_id": "ST-2",
          "company_id": "부산지점",
          "item_cd": "B0201001",
          "inventory_type": "CONDOLENCE_FLAG",
          "qty": "10",
          "reserved_qty": "0",
          "base_qty": "10"
        }
      ],
      [
        "InventoryStocks",
        "ST-3",
        {
          "stock_id": "ST-3",
          "company_id": "서울지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "qty": "0",
          "reserved_qty": "0",
          "base_qty": "null"
        }
      ],
      [
        "InventoryStocks",
        "ST-4",
        {
          "stock_id": "ST-4",
          "company_id": "서울지점",
          "item_cd": "B0201001",
          "inventory_type": "CONDOLENCE_FLAG",
          "qty": "0",
          "reserved_qty": "0",
          "base_qty": "10"
        }
      ],
      [
        "InventoryUnits",
        "U-1",
        {
          "unit_id": "U-1",
          "barcode": "BC-1001",
          "company_id": "부산지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "status": "IN_STOCK",
          "last_issue_id": "null"
        }
      ],
      [
        "InventoryUnits",
        "U-2",
        {
          "unit_id": "U-2",
          "barcode": "BC-1002",
          "company_id": "부산지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "status": "IN_STOCK",
          "last_issue_id": "null"
        }
      ]
    ],
    "steps": [
      {
        "no": "1",
        "name": "발주 확정 접수",
        "actor": "현진웹 (행사관리)",
        "api": "POST /v1/fsms/partners/flower/hjw-orders",
        "service": "FlowerOrdersService.create",
        "description": "주문이 두 건 생긴다. 출발 지점 주문(DEPARTURE)과 도착 지점 주문(ARRIVAL)이고, 둘 다 같은 이동을 가리킨다. 이동만 만들고 수량 예약은 하지 않는다.",
        "note": "주문 품목은 네 행이다. 출발 지점 주문과 도착 지점 주문이 같은 품목 스냅샷을 각각 갖는다. 두 주문의 inventory_stock_id 는 모두 출발사(부산지점) 재고 행을 가리킨다. 재고가 나가는 회사가 출발사이기 때문이다. 이동을 만들 때 reserveQuantityItems 를 false 로 넘기므로 예약은 2단계로 미뤄진다(flower-orders.service.ts:1125).",
        "operations": [
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-D",
            "type": "INSERT",
            "values": {
              "order_id": "FO-D",
              "order_no": "PO-2026-0002",
              "company_id": "부산지점",
              "consignment_type": "DEPARTURE",
              "order_status": "ORDERED",
              "inventory_transfer_id": "TR-1"
            }
          },
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-A",
            "type": "INSERT",
            "values": {
              "order_id": "FO-A",
              "order_no": "PO-2026-0002",
              "company_id": "서울지점",
              "consignment_type": "ARRIVAL",
              "order_status": "ORDERED",
              "inventory_transfer_id": "TR-1"
            }
          },
          {
            "table": "FevFlowerOrderItems",
            "identifier": "FOI-D1",
            "type": "INSERT",
            "values": {
              "flower_order_item_id": "FOI-D1",
              "flower_order_id": "FO-D",
              "line_no_snapshot": "1",
              "item_code_snapshot": "A0100010",
              "item_name_snapshot": "[조사용품] 현진시닝(300인분)",
              "unit_snapshot": "BOX",
              "quantity_snapshot": "2",
              "inventory_stock_id": "ST-1"
            }
          },
          {
            "table": "FevFlowerOrderItems",
            "identifier": "FOI-D2",
            "type": "INSERT",
            "values": {
              "flower_order_item_id": "FOI-D2",
              "flower_order_id": "FO-D",
              "line_no_snapshot": "2",
              "item_code_snapshot": "B0201001",
              "item_name_snapshot": "근조기",
              "unit_snapshot": "EA",
              "quantity_snapshot": "3",
              "inventory_stock_id": "ST-2"
            }
          },
          {
            "table": "FevFlowerOrderItems",
            "identifier": "FOI-A1",
            "type": "INSERT",
            "values": {
              "flower_order_item_id": "FOI-A1",
              "flower_order_id": "FO-A",
              "line_no_snapshot": "1",
              "item_code_snapshot": "A0100010",
              "item_name_snapshot": "[조사용품] 현진시닝(300인분)",
              "unit_snapshot": "BOX",
              "quantity_snapshot": "2",
              "inventory_stock_id": "ST-1"
            }
          },
          {
            "table": "FevFlowerOrderItems",
            "identifier": "FOI-A2",
            "type": "INSERT",
            "values": {
              "flower_order_item_id": "FOI-A2",
              "flower_order_id": "FO-A",
              "line_no_snapshot": "2",
              "item_code_snapshot": "B0201001",
              "item_name_snapshot": "근조기",
              "unit_snapshot": "EA",
              "quantity_snapshot": "3",
              "inventory_stock_id": "ST-2"
            }
          },
          {
            "table": "InvTransfers",
            "identifier": "TR-1",
            "type": "INSERT",
            "values": {
              "transfer_id": "TR-1",
              "transfer_type": "TRANSFER",
              "source_company_id": "부산지점",
              "destination_company_id": "서울지점",
              "status": "PREPARING",
              "issue_id": "null",
              "receipt_id": "null"
            }
          },
          {
            "table": "InvTransferItems",
            "identifier": "TI-1",
            "type": "INSERT",
            "values": {
              "transfer_item_id": "TI-1",
              "transfer_id": "TR-1",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "requested_qty": "2"
            }
          },
          {
            "table": "InvTransferItems",
            "identifier": "TI-2",
            "type": "INSERT",
            "values": {
              "transfer_item_id": "TI-2",
              "transfer_id": "TR-1",
              "item_cd": "B0201001",
              "inventory_type": "CONDOLENCE_FLAG",
              "requested_qty": "3"
            }
          }
        ]
      },
      {
        "no": "2",
        "name": "상품 준비",
        "actor": "출발 지점 담당자",
        "api": "POST /v1/fsms/partners/flower/orders/:id/confirm",
        "service": "FlowerOrdersService.confirm → InventoryTransferService.reserveQuantityItemsInTransaction",
        "description": "출발 지점 주문의 상태가 바뀌고 출발사 근조기 재고가 예약된다. qty 는 그대로이고 reserved_qty 만 오른다.",
        "note": "비탁송 2단계와 같은 조건을 쓴다. 수량 단위로 예약하는 것은 근조기ㆍ축기이고, 조사용품은 3단계 바코드 스캔에서 낱개마다 예약된다(inventory-transfer.service.ts:171).",
        "todo": "근조기 재고 행은 qty 가 0인 경우가 많아 예약이 통과하지 않는다(:931). 현재고를 qty 로 통일하면 해결된다.",
        "operations": [
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-D",
            "type": "UPDATE",
            "values": {
              "order_status": "CONFIRMED"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-2",
            "type": "UPDATE",
            "values": {
              "reserved_qty": "3"
            }
          }
        ]
      },
      {
        "no": "3",
        "name": "상차 품목 확인",
        "actor": "출발 지점 담당자",
        "api": "POST /v1/fsms/partners/flower/orders/:id/item-verifications",
        "service": "FlowerOrdersService.verifyItems → InventoryTransferService.reserveBarcode",
        "description": "실을 조사용품 바코드를 스캔한다. 유닛이 RESERVED 로 바뀌고 이동 품목과 연결된다.",
        "operations": [
          {
            "table": "InvTransferItemUnits",
            "identifier": "TU-1",
            "type": "INSERT",
            "values": {
              "id": "TU-1",
              "transfer_item_id": "TI-1",
              "inventory_unit_id": "U-1",
              "unloaded_at": "null"
            }
          },
          {
            "table": "InvTransferItemUnits",
            "identifier": "TU-2",
            "type": "INSERT",
            "values": {
              "id": "TU-2",
              "transfer_item_id": "TI-1",
              "inventory_unit_id": "U-2",
              "unloaded_at": "null"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-1",
            "type": "UPDATE",
            "values": {
              "status": "RESERVED"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-2",
            "type": "UPDATE",
            "values": {
              "status": "RESERVED"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-1",
            "type": "UPDATE",
            "values": {
              "reserved_qty": "2"
            }
          }
        ]
      },
      {
        "no": "4",
        "name": "상차",
        "actor": "출발 지점 담당자",
        "api": "POST /v1/fsms/partners/flower/orders/:id/ship",
        "service": "FlowerOrdersService.ship → InventoryTransferService.loadTransfer",
        "description": "부산에서 재고가 나간다. 출고 전표를 남긴다. 다른 회사로 가는 것이므로 issue_type은 TRANSFER다.",
        "note": "CONSUME이 아니라 TRANSFER인 것이 중요하다. 사용수량은 CONSUME만 세므로, 회사 사이 이동이 사용량으로 잡히지 않는다. 부산의 근조기 잔여수량이 줄지 않는 이유가 이것이다.",
        "operations": [
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-D",
            "type": "UPDATE",
            "values": {
              "order_status": "DELIVERING"
            }
          },
          {
            "table": "InventoryIssues",
            "identifier": "ISS-1",
            "type": "INSERT",
            "values": {
              "issue_id": "ISS-1",
              "company_id": "부산지점",
              "issue_type": "TRANSFER",
              "status": "COMPLETED",
              "issued_at": "2026-08-20 09:30"
            }
          },
          {
            "table": "InventoryIssueItems",
            "identifier": "II-1",
            "type": "INSERT",
            "values": {
              "issue_item_id": "II-1",
              "issue_id": "ISS-1",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "qty": "2"
            }
          },
          {
            "table": "InventoryIssueItems",
            "identifier": "II-2",
            "type": "INSERT",
            "values": {
              "issue_item_id": "II-2",
              "issue_id": "ISS-1",
              "item_cd": "B0201001",
              "inventory_type": "CONDOLENCE_FLAG",
              "qty": "3"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-1",
            "type": "UPDATE",
            "values": {
              "status": "IN_TRANSIT",
              "last_issue_id": "ISS-1"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-2",
            "type": "UPDATE",
            "values": {
              "status": "IN_TRANSIT",
              "last_issue_id": "ISS-1"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-1",
            "type": "UPDATE",
            "values": {
              "qty": "3",
              "reserved_qty": "0"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-2",
            "type": "UPDATE",
            "values": {
              "qty": "7",
              "reserved_qty": "0"
            }
          },
          {
            "table": "InvTransfers",
            "identifier": "TR-1",
            "type": "UPDATE",
            "values": {
              "status": "IN_TRANSIT",
              "issue_id": "ISS-1"
            }
          }
        ]
      },
      {
        "no": "5",
        "name": "하차",
        "actor": "도착 지점 담당자",
        "api": "POST .../unload-barcodes  ·  PATCH .../complete",
        "service": "InventoryTransferService.scanUnloadBarcode → completeUnload",
        "description": "서울로 재고가 들어온다. 입고 전표를 남기고 도착사 재고 수량이 늘어난다. 유닛은 서울의 재고가 된다.",
        "note": "상차가 출발사에 남기는 출고 전표에 대응하는 처리다. 스캔 세션을 거치지 않으므로 전표가 바로 COMPLETED 로 만들어진다. 조사용품 입고 품목은 바코드마다 한 행이고 근조기ㆍ축기는 수량 한 행이다.",
        "todo": "근조기ㆍ축기 사용수량 집계가 입고 전표 유형과 무관해서(ceremonial-flag-inventory.service.ts:103) 이 TRANSFER 입고 전표까지 반납으로 차감한다. 서울의 근조기 사용수량이 3 줄어 실제보다 적게 나온다.",
        "operations": [
          {
            "table": "InventoryReceipts",
            "identifier": "RCP-1",
            "type": "INSERT",
            "values": {
              "receipt_id": "RCP-1",
              "company_id": "서울지점",
              "receipt_type": "TRANSFER",
              "status": "COMPLETED",
              "receipt_dt": "2026-08-20 14:05"
            }
          },
          {
            "table": "InventoryReceiptItems",
            "identifier": "RI-1",
            "type": "INSERT",
            "values": {
              "receipt_item_id": "RI-1",
              "receipt_id": "RCP-1",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "qty": "1",
              "barcode": "BC-1001"
            }
          },
          {
            "table": "InventoryReceiptItems",
            "identifier": "RI-2",
            "type": "INSERT",
            "values": {
              "receipt_item_id": "RI-2",
              "receipt_id": "RCP-1",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "qty": "1",
              "barcode": "BC-1002"
            }
          },
          {
            "table": "InventoryReceiptItems",
            "identifier": "RI-3",
            "type": "INSERT",
            "values": {
              "receipt_item_id": "RI-3",
              "receipt_id": "RCP-1",
              "item_cd": "B0201001",
              "inventory_type": "CONDOLENCE_FLAG",
              "qty": "3",
              "barcode": "null"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-1",
            "type": "UPDATE",
            "values": {
              "company_id": "서울지점",
              "status": "IN_STOCK"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-2",
            "type": "UPDATE",
            "values": {
              "company_id": "서울지점",
              "status": "IN_STOCK"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-3",
            "type": "UPDATE",
            "values": {
              "qty": "2"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-4",
            "type": "UPDATE",
            "values": {
              "qty": "3"
            }
          },
          {
            "table": "InvTransfers",
            "identifier": "TR-1",
            "type": "UPDATE",
            "values": {
              "status": "COMPLETED",
              "receipt_id": "RCP-1"
            }
          },
          {
            "table": "InvTransferItemUnits",
            "identifier": "TU-1",
            "type": "UPDATE",
            "values": {
              "unloaded_at": "2026-08-20 14:05"
            }
          },
          {
            "table": "InvTransferItemUnits",
            "identifier": "TU-2",
            "type": "UPDATE",
            "values": {
              "unloaded_at": "2026-08-20 14:05"
            }
          },
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-A",
            "type": "UPDATE",
            "values": {
              "order_status": "CONFIRMED"
            }
          }
        ]
      },
      {
        "no": "6",
        "name": "배송",
        "actor": "도착 지점 담당자",
        "api": "POST /v1/fsms/partners/flower/orders/:id/ship",
        "service": "FlowerOrdersService.ship",
        "description": "서울에서 장례식장으로 나간다. 여기서부터는 비탁송의 4단계와 완전히 같다.",
        "note": "도착 지점이 다른 지점과 같은 상태를 거친다. 받으면 입고, 내보내면 출고다. 이번 CONSUME 전표가 서울의 근조기 사용수량 3을 만든다.",
        "todo": "Task 9. 비탁송 4단계와 같다. 지금은 출고 전표를 만들지 않는다.",
        "derived": [
          [
            "서울 근조기 현재고(qty)",
            "3 → 0"
          ],
          [
            "서울 근조기 기준수량",
            "10"
          ],
          [
            "서울 근조기 사용수량",
            "0 → 3"
          ]
        ],
        "operations": [
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-A",
            "type": "UPDATE",
            "values": {
              "order_status": "DELIVERING"
            }
          },
          {
            "table": "InventoryIssues",
            "identifier": "ISS-2",
            "type": "INSERT",
            "values": {
              "issue_id": "ISS-2",
              "company_id": "서울지점",
              "issue_type": "CONSUME",
              "status": "COMPLETED",
              "issued_at": "2026-08-20 15:40"
            }
          },
          {
            "table": "InventoryIssueItems",
            "identifier": "II-3",
            "type": "INSERT",
            "values": {
              "issue_item_id": "II-3",
              "issue_id": "ISS-2",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "qty": "2"
            }
          },
          {
            "table": "InventoryIssueItems",
            "identifier": "II-4",
            "type": "INSERT",
            "values": {
              "issue_item_id": "II-4",
              "issue_id": "ISS-2",
              "item_cd": "B0201001",
              "inventory_type": "CONDOLENCE_FLAG",
              "qty": "3"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-1",
            "type": "UPDATE",
            "values": {
              "status": "CONSUMED",
              "last_issue_id": "ISS-2"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-2",
            "type": "UPDATE",
            "values": {
              "status": "CONSUMED",
              "last_issue_id": "ISS-2"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-3",
            "type": "UPDATE",
            "values": {
              "qty": "0"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-4",
            "type": "UPDATE",
            "values": {
              "qty": "0"
            }
          }
        ]
      },
      {
        "no": "7",
        "name": "배송 완료",
        "actor": "도착 지점 담당자",
        "api": "POST /v1/fsms/partners/flower/orders/:id/deliver",
        "service": "FlowerOrdersService.deliver",
        "description": "두 주문이 함께 완료된다. 재고 차감은 6단계에서 끝났다.",
        "operations": [
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-A",
            "type": "UPDATE",
            "values": {
              "order_status": "DELIVERED"
            }
          },
          {
            "table": "FevFlowerOrders",
            "identifier": "FO-D",
            "type": "UPDATE",
            "values": {
              "order_status": "DELIVERED"
            }
          }
        ]
      }
    ]
  },
  {
    "name": "물류센터 입고",
    "description": "물류센터에서 지점으로 조사용품이 온다. 물류센터가 넘기는 것은 어디서 어디로 어떤 품목을 몇 개 보내는지까지다. 바코드는 넘어오지 않고 지점이 받아서 찍을 때 처음 등록된다.",
    "scenario": [
      {
        "type": "heading",
        "text": "입고 내용"
      },
      {
        "type": "text",
        "lines": [
          "물류센터에서 서울지점으로 조사용품이 온다. 발송 전표번호는 WH-12345다.",
          "물류센터를 Company 1행으로 등록한다. 입고 목록의 출고 창고 열이 이동 출발사의 회사명을 그대로 읽으므로, 창고와 지점이 한 열에 섞여 나오는 화면이 그대로 성립한다.",
          "재고 쪽에 추가되는 것은 InvTransfers.erp_doc_no 컬럼 하나다. 같은 발송을 두 번 받아도 이 컬럼으로 걸러진다."
        ]
      },
      {
        "type": "table",
        "title": "지금 동작과의 차이",
        "columns": [
          "",
          "지금",
          "이 탭이 그리는 모습"
        ],
        "rows": [
          [
            "물류센터 발송 시",
            "우리 DB에 아무 행도 생기지 않는다",
            "이동 1행, 품목 1행이 생긴다"
          ],
          [
            "지점이 미리 아는 것",
            "없다. 물건이 와야 안다",
            "들어올 품목과 수량. 바코드는 모른다"
          ],
          [
            "스캔 판정",
            "예정이 없어 전부 예정 밖으로 나온다",
            "예정 수량과 대조해 초과를 가른다"
          ],
          [
            "입고 전표 유형",
            "EXTERNAL",
            "TRANSFER"
          ],
          [
            "유닛이 생기는 시점",
            "같다. 지점이 찍고 입고를 완료할 때"
          ],
          [
            "화면",
            "같다. 입고 스캔 세션 하나를 쓴다"
          ]
        ]
      },
      {
        "type": "table",
        "columns": [
          "품목코드",
          "품목명",
          "재고유형",
          "단위",
          "발송 수량",
          "바코드"
        ],
        "rows": [
          [
            "A0100010",
            "[조사용품] 현진시닝(300인분)",
            "FUNERAL_SUPPLIES",
            "BOX",
            "2",
            "발송 시점에는 없다"
          ]
        ]
      }
    ],
    "base": [
      [
        "InventoryStocks",
        "ST-1",
        {
          "stock_id": "ST-1",
          "company_id": "서울지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "qty": "0",
          "reserved_qty": "0",
          "base_qty": "null"
        }
      ]
    ],
    "steps": [
      {
        "no": "1",
        "name": "발송 내역 적재",
        "actor": "배치 또는 물류센터 호출",
        "api": "정해지지 않음",
        "service": "발송 내역 적재",
        "description": "물류센터가 보낸 발송 내역으로 이동 행을 만든다. 물류센터가 이미 실어 보냈으므로 status 를 PREPARING 이 아니라 IN_TRANSIT 으로 바로 만든다.",
        "note": "바코드가 넘어오지 않으므로 유닛도 이동 품목과 유닛을 잇는 연결 행도 만들지 않는다. 이동과 품목 두 행이 전부다. 탁송은 상차 스캔이 있어 이 자리에서 유닛과 연결이 생기고, 물류센터 발송은 그 단계가 없다.",
        "todo": "적재 경로가 정해지지 않았다. 물류센터가 우리 테이블에 넣을지 우리가 API를 열지가 미정이다. 지금은 이 단계가 없어 물류센터 발송 시 우리 DB에 아무 행도 생기지 않는다.",
        "operations": [
          {
            "table": "InvTransfers",
            "identifier": "TR-1",
            "type": "INSERT",
            "values": {
              "transfer_id": "TR-1",
              "transfer_type": "TRANSFER",
              "source_company_id": "물류센터",
              "destination_company_id": "서울지점",
              "status": "IN_TRANSIT",
              "issue_id": "null",
              "receipt_id": "null",
              "erp_doc_no": "WH-12345"
            }
          },
          {
            "table": "InvTransferItems",
            "identifier": "TI-1",
            "type": "INSERT",
            "values": {
              "transfer_item_id": "TI-1",
              "transfer_id": "TR-1",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "requested_qty": "2"
            }
          }
        ]
      },
      {
        "no": "2",
        "name": "지점이 예정 확인",
        "actor": "지점 담당자",
        "api": "GET /v1/fsms/inventory/inbound-transfers",
        "service": "InventoryScanService.inboundTransfers",
        "description": "입고 목록에 들어올 품목과 수량이 보인다. 재고 테이블은 바뀌지 않는다. 조회만 한다.",
        "note": "예정 수량은 지금 코드로 그대로 나온다. loadBaselineTransfers 가 도착사 기준 IN_TRANSIT 이동을 찾기 때문이다(inventory-scan.service.ts:93).",
        "todo": "입고완료 수량이 늘 0으로 나온다. 상차 바코드와 입고 바코드의 교집합으로 세는데(:1015) 물류센터 발송에는 상차 바코드가 없다. 같은 품목이 여러 창고에서 오면 찍은 바코드를 어느 발송 건에 귀속할지도 정해지지 않았다.",
        "operations": []
      },
      {
        "no": "3",
        "name": "입고 스캔",
        "actor": "지점 담당자",
        "api": "POST /v1/fsms/inventory/scan-sessions  ·  POST .../:id/scan",
        "service": "InventoryScanService.start → scan",
        "description": "입고 세션을 열고 받은 물건의 바코드를 찍는다. 바코드가 여기서 처음 등장한다. 스캔 1건이 이벤트 행으로 쌓이고 재고 테이블은 아직 바뀌지 않는다.",
        "note": "화환 탁송 하차(scanUnloadBarcode)가 아니라 입고 스캔 세션을 탄다. loadBaselineTransfers 가 플라워 주문이 붙지 않은 이동만 찾으므로 물류센터 이동이 여기에 걸린다. 같은 판정을 부작용 없이 미리 보는 GET .../lookup 이 따로 있고, 그쪽은 행을 만들지 않는다.",
        "todo": "전표 유형만 다르다. 1단계 이동이 없으면 이 전표가 TRANSFER 가 아니라 EXTERNAL 로 만들어진다. 지금이 그 상태다.",
        "operations": [
          {
            "table": "InventoryReceipts",
            "identifier": "RCP-1",
            "type": "INSERT",
            "values": {
              "receipt_id": "RCP-1",
              "company_id": "서울지점",
              "receipt_type": "TRANSFER",
              "status": "IN_PROGRESS",
              "receipt_dt": "2026-08-21 10:20"
            }
          },
          {
            "table": "InventoryScanSessions",
            "identifier": "SS-1",
            "type": "INSERT",
            "values": {
              "scan_session_id": "SS-1",
              "session_type": "RECEIVING",
              "company_id": "서울지점",
              "inventory_type": "FUNERAL_SUPPLIES",
              "status": "IN_PROGRESS",
              "receipt_id": "RCP-1"
            }
          },
          {
            "table": "InventoryScanEvents",
            "identifier": "EV-1",
            "type": "INSERT",
            "values": {
              "scan_event_id": "EV-1",
              "scan_session_id": "SS-1",
              "barcode": "BC-2001",
              "item_cd": "A0100010",
              "result_code": "NORMAL",
              "voided": "false"
            }
          },
          {
            "table": "InventoryScanEvents",
            "identifier": "EV-2",
            "type": "INSERT",
            "values": {
              "scan_event_id": "EV-2",
              "scan_session_id": "SS-1",
              "barcode": "BC-2002",
              "item_cd": "A0100010",
              "result_code": "NORMAL",
              "voided": "false"
            }
          }
        ]
      },
      {
        "no": "4",
        "name": "입고 완료",
        "actor": "지점 담당자",
        "api": "POST /v1/fsms/inventory/scan-sessions/:id/complete",
        "service": "InventoryScanService.complete",
        "description": "찍은 바코드가 유닛으로 등록되어 서울지점 재고가 되고 입고 품목과 재고 수량이 채워진다. 이동도 함께 수령 처리된다.",
        "note": "유닛은 이 시점에 새로 만들어진다. 입고 품목 행은 바코드마다 한 줄씩 qty 1 로 쌓인다. 이 흐름의 바코드는 여기서 처음이자 마지막으로 등록되므로 넘겨받을 유닛이 없다.",
        "operations": [
          {
            "table": "InventoryUnits",
            "identifier": "U-1",
            "type": "INSERT",
            "values": {
              "unit_id": "U-1",
              "barcode": "BC-2001",
              "company_id": "서울지점",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "status": "IN_STOCK",
              "last_issue_id": "null"
            }
          },
          {
            "table": "InventoryUnits",
            "identifier": "U-2",
            "type": "INSERT",
            "values": {
              "unit_id": "U-2",
              "barcode": "BC-2002",
              "company_id": "서울지점",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "status": "IN_STOCK",
              "last_issue_id": "null"
            }
          },
          {
            "table": "InventoryReceiptItems",
            "identifier": "RI-1",
            "type": "INSERT",
            "values": {
              "receipt_item_id": "RI-1",
              "receipt_id": "RCP-1",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "qty": "1",
              "barcode": "BC-2001"
            }
          },
          {
            "table": "InventoryReceiptItems",
            "identifier": "RI-2",
            "type": "INSERT",
            "values": {
              "receipt_item_id": "RI-2",
              "receipt_id": "RCP-1",
              "item_cd": "A0100010",
              "inventory_type": "FUNERAL_SUPPLIES",
              "qty": "1",
              "barcode": "BC-2002"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-1",
            "type": "UPDATE",
            "values": {
              "qty": "2"
            }
          },
          {
            "table": "InventoryReceipts",
            "identifier": "RCP-1",
            "type": "UPDATE",
            "values": {
              "status": "COMPLETED"
            }
          },
          {
            "table": "InventoryScanSessions",
            "identifier": "SS-1",
            "type": "UPDATE",
            "values": {
              "status": "COMPLETED"
            }
          },
          {
            "table": "InvTransfers",
            "identifier": "TR-1",
            "type": "UPDATE",
            "values": {
              "status": "COMPLETED",
              "receipt_id": "RCP-1"
            }
          }
        ]
      }
    ]
  },
  {
    "name": "재고 실사 (조사용품)",
    "description": "장부 수량과 실제 물건이 맞는지 대조한다. 입고와 같은 QR 스캔 화면을 쓰고 session_type 만 AUDIT 으로 다르다.",
    "scenario": [
      {
        "type": "heading",
        "text": "실사 내용"
      },
      {
        "type": "text",
        "lines": [
          "서울지점이 조사용품 재고를 실사한다.",
          "장부에는 3개로 되어 있는데 실제로는 2개만 있는 상황이다. 실사가 그 차이를 드러낸다.",
          "이 화면은 조사용품 전용이다. start 가 FUNERAL_SUPPLIES 만 허용한다. 근조기ㆍ축기는 이 세션을 쓰지 않고 6번 탭의 수동 실사를 쓴다."
        ]
      },
      {
        "type": "table",
        "columns": [
          "품목코드",
          "품목명",
          "장부 수량",
          "실제 수량",
          "바코드"
        ],
        "rows": [
          [
            "A0100010",
            "[조사용품] 현진시닝(300인분)",
            "3",
            "2",
            "BC-3001, BC-3002 (BC-3003 은 없음)"
          ]
        ]
      }
    ],
    "base": [
      [
        "InventoryStocks",
        "ST-1",
        {
          "stock_id": "ST-1",
          "company_id": "서울지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "qty": "3",
          "reserved_qty": "0",
          "base_qty": "null"
        }
      ],
      [
        "InventoryUnits",
        "U-1",
        {
          "unit_id": "U-1",
          "barcode": "BC-3001",
          "company_id": "서울지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "status": "IN_STOCK",
          "last_issue_id": "null"
        }
      ],
      [
        "InventoryUnits",
        "U-2",
        {
          "unit_id": "U-2",
          "barcode": "BC-3002",
          "company_id": "서울지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "status": "IN_STOCK",
          "last_issue_id": "null"
        }
      ],
      [
        "InventoryUnits",
        "U-3",
        {
          "unit_id": "U-3",
          "barcode": "BC-3003",
          "company_id": "서울지점",
          "item_cd": "A0100010",
          "inventory_type": "FUNERAL_SUPPLIES",
          "status": "IN_STOCK",
          "last_issue_id": "null"
        }
      ]
    ],
    "steps": [
      {
        "no": "1",
        "name": "실사 세션 시작",
        "actor": "지점 담당자",
        "api": "POST /v1/fsms/inventory/scan-sessions",
        "service": "InventoryScanService.start (sessionType=AUDIT)",
        "description": "실사 1건과 품목 행이 생긴다. 이 시점의 재고 수량이 book_qty 로 복사된다.",
        "note": "입고 세션과 같은 API 를 쓰고 sessionType 만 다르다. 입고는 InventoryReceipts 를 만들고 세션의 receipt_id 에 연결하는데, 실사는 InventoryAudits 를 만들고 audit_id 에 연결한다. 세션 테이블은 하나다.",
        "operations": [
          {
            "table": "InventoryAudits",
            "identifier": "AUD-1",
            "type": "INSERT",
            "values": {
              "inventory_audit_id": "AUD-1",
              "company_id": "서울지점",
              "inventory_type": "FUNERAL_SUPPLIES",
              "status": "IN_PROGRESS",
              "audit_dt": "2026-08-20 14:00"
            }
          },
          {
            "table": "InventoryAuditItems",
            "identifier": "AI-1",
            "type": "INSERT",
            "values": {
              "inventory_audit_item_id": "AI-1",
              "inventory_audit_id": "AUD-1",
              "item_cd": "A0100010",
              "book_qty": "3",
              "actual_qty": "null",
              "diff_qty": "null"
            }
          },
          {
            "table": "InventoryScanSessions",
            "identifier": "SS-1",
            "type": "INSERT",
            "values": {
              "scan_session_id": "SS-1",
              "session_type": "AUDIT",
              "company_id": "서울지점",
              "inventory_type": "FUNERAL_SUPPLIES",
              "status": "IN_PROGRESS",
              "receipt_id": "null"
            }
          }
        ]
      },
      {
        "no": "2",
        "name": "바코드 스캔",
        "actor": "지점 담당자",
        "api": "POST /v1/fsms/inventory/scan-sessions/:id/scan",
        "service": "InventoryScanService.scan",
        "description": "창고에 실제로 있는 물건의 바코드를 찍는다. 여기서는 BC-3001 과 BC-3002 만 찍힌다. BC-3003 은 물건이 없어 못 찍는다.",
        "note": "스캔 1건이 이벤트 행으로 쌓인다. 실사 품목의 actual_qty 는 아직 비어 있고 완료 시점에 이벤트를 집계해 채운다.",
        "operations": [
          {
            "table": "InventoryScanEvents",
            "identifier": "EV-1",
            "type": "INSERT",
            "values": {
              "scan_event_id": "EV-1",
              "scan_session_id": "SS-1",
              "barcode": "BC-3001",
              "item_cd": "A0100010",
              "result_code": "NORMAL",
              "voided": "false"
            }
          },
          {
            "table": "InventoryScanEvents",
            "identifier": "EV-2",
            "type": "INSERT",
            "values": {
              "scan_event_id": "EV-2",
              "scan_session_id": "SS-1",
              "barcode": "BC-3002",
              "item_cd": "A0100010",
              "result_code": "NORMAL",
              "voided": "false"
            }
          }
        ]
      },
      {
        "no": "3",
        "name": "실사 완료",
        "actor": "지점 담당자",
        "api": "POST /v1/fsms/inventory/scan-sessions/:id/complete",
        "service": "InventoryScanService.complete (AUDIT 분기)",
        "description": "찍힌 수를 실제 수량으로 기록하고 차이를 남긴다. 조사용품은 재고 수량을 실사 수량으로 덮어쓴다.",
        "note": "조사용품만 파괴적 덮어쓰기다(qty = actual_qty). 없어진 BC-3003 의 유닛 행은 지우지 않는다. 수량만 2로 맞춘다. 반대로 장부에 없던 바코드를 찍으면 유닛 행을 새로 만든다.",
        "operations": [
          {
            "table": "InventoryAuditItems",
            "identifier": "AI-1",
            "type": "UPDATE",
            "values": {
              "actual_qty": "2",
              "diff_qty": "-1"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-1",
            "type": "UPDATE",
            "values": {
              "qty": "2"
            }
          },
          {
            "table": "InventoryAudits",
            "identifier": "AUD-1",
            "type": "UPDATE",
            "values": {
              "status": "COMPLETED"
            }
          },
          {
            "table": "InventoryScanSessions",
            "identifier": "SS-1",
            "type": "UPDATE",
            "values": {
              "status": "COMPLETED"
            }
          }
        ]
      }
    ]
  },
  {
    "name": "근조기ㆍ축기 (수량 재고)",
    "description": "근조기와 축기는 바코드도 유닛 행도 없다. 그 점만 조사용품과 다르고, 현재고를 읽는 자리는 같다. 두 유형 모두 InventoryStocks.qty 가 현재고이고 qty - reserved_qty 가 가용재고다.",
    "scenario": [
      {
        "type": "heading",
        "text": "계산식"
      },
      {
        "type": "text",
        "lines": [
          "현재고 = InventoryStocks.qty. 조사용품과 같은 컬럼을 같은 뜻으로 읽는다",
          "가용재고 = qty - reserved_qty. 이것도 같다",
          "기준수량 = base_qty. 이 품목을 몇 개 갖고 있어야 하는지를 정한 목표치다. 현재고 계산에 들어가지 않는다",
          "사용수량 = 확정 출고 합 - 확정 반납입고 합. 얼마나 나갔는지를 보여주는 기록값이고 현재고를 만들지 않는다",
          "재고편차 = 실사수량 - 실사 시작 시점의 현재고. 실사 품목 행에 저장된다"
        ]
      },
      {
        "type": "table",
        "title": "조사용품과의 차이",
        "columns": [
          "",
          "조사용품",
          "근조기ㆍ축기"
        ],
        "rows": [
          [
            "현재고",
            "같다. InventoryStocks.qty"
          ],
          [
            "가용재고",
            "같다. qty - reserved_qty"
          ],
          [
            "바코드 낱개 추적",
            "한다. InventoryUnits 1행",
            "하지 않는다. 유닛 행 없음"
          ],
          [
            "입고",
            "QR 스캔 세션",
            "반납 입고 팝업에 수량 직접 입력"
          ],
          [
            "실사",
            "QR 스캔으로 수량 집계",
            "수동 실사에 수량 직접 입력"
          ],
          [
            "기준 대비",
            "min_qty(안전 재고)와 비교",
            "base_qty(기준수량)와 비교"
          ]
        ]
      },
      {
        "type": "heading",
        "text": "이 흐름의 숫자"
      },
      {
        "type": "table",
        "columns": [
          "단계",
          "qty (현재고)",
          "기준",
          "사용",
          "실사",
          "편차"
        ],
        "rows": [
          [
            "1. 기준수량 설정",
            "10",
            "10",
            "0",
            "-",
            "-"
          ],
          [
            "2. 출고 7",
            "3",
            "10",
            "7",
            "-",
            "-"
          ],
          [
            "3. 반납 입고 2",
            "5",
            "10",
            "5",
            "-",
            "-"
          ],
          [
            "5. 실사 완료",
            "3",
            "10",
            "5",
            "3",
            "-2"
          ]
        ]
      }
    ],
    "base": [
      [
        "InventoryStocks",
        "ST-1",
        {
          "stock_id": "ST-1",
          "company_id": "서울지점",
          "item_cd": "B0201001",
          "inventory_type": "CONDOLENCE_FLAG",
          "qty": "10",
          "reserved_qty": "0",
          "base_qty": "null"
        }
      ]
    ],
    "steps": [
      {
        "no": "1",
        "name": "기준수량 설정",
        "actor": "본사 관리자",
        "api": "PATCH /v1/fsms/inventory/ceremonial-flags/stocks/:id",
        "service": "CeremonialFlagInventoryService.updateBaseQty",
        "description": "이 지점이 이 품목을 몇 개 갖고 있어야 하는지를 정한다. 컬럼을 바꾸고 변경 이력을 함께 남긴다. 현재고(qty)는 건드리지 않는다.",
        "note": "본사 관리자만 할 수 있다. 이력에 이전 값과 새 값과 사유가 남는다. 기준수량은 목표치이므로 현재고와 다를 수 있고, 그 차이가 채워야 할 양이다.",
        "derived": [
          [
            "현재고(qty)",
            "10"
          ],
          [
            "기준수량",
            "비어 있음 → 10"
          ],
          [
            "사용수량",
            "0"
          ]
        ],
        "operations": [
          {
            "table": "InventoryStocks",
            "identifier": "ST-1",
            "type": "UPDATE",
            "values": {
              "base_qty": "10"
            }
          },
          {
            "table": "InventoryBaseQtyHistory",
            "identifier": "BH-1",
            "type": "INSERT",
            "values": {
              "base_qty_history_id": "BH-1",
              "inventory_stock_id": "ST-1",
              "item_cd": "B0201001",
              "old_qty": "null",
              "new_qty": "10",
              "reason": "지점 표준 배치량 반영"
            }
          }
        ]
      },
      {
        "no": "2",
        "name": "출고 7",
        "actor": "지점 담당자",
        "api": "행사 진행에 따라",
        "service": "출고 경로",
        "description": "근조기 7개가 나간다. 현재고가 7 줄고, 나간 사실이 출고 전표로 남는다. 외부로 나가는 것이므로 issue_type 은 CONSUME 이다.",
        "note": "회사 사이 이동(TRANSFER)은 사용수량에 세지 않는다. 다른 지점으로 보낸 것은 회사 밖으로 나간 것이 아니기 때문이다. 수량 차감은 이동이든 소모든 똑같이 일어난다.",
        "todo": "Task 9. CONSUME 전표를 만드는 경로가 없다. 출고 전표를 만드는 자리는 상차 하나뿐이고 그것은 TRANSFER 다(inventory-transfer.service.ts:509). 사용수량을 세는 원천은 InventoryIssues 로 이미 옮겼다(ceremonial-flag-inventory.service.ts:94).",
        "derived": [
          [
            "현재고(qty)",
            "10 → 3"
          ],
          [
            "기준수량",
            "10"
          ],
          [
            "사용수량",
            "0 → 7"
          ]
        ],
        "operations": [
          {
            "table": "InventoryIssues",
            "identifier": "ISS-1",
            "type": "INSERT",
            "values": {
              "issue_id": "ISS-1",
              "company_id": "서울지점",
              "issue_type": "CONSUME",
              "status": "COMPLETED",
              "issued_at": "2026-08-20 09:10"
            }
          },
          {
            "table": "InventoryIssueItems",
            "identifier": "II-1",
            "type": "INSERT",
            "values": {
              "issue_item_id": "II-1",
              "issue_id": "ISS-1",
              "item_cd": "B0201001",
              "inventory_type": "CONDOLENCE_FLAG",
              "qty": "7"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-1",
            "type": "UPDATE",
            "values": {
              "qty": "3"
            }
          }
        ]
      },
      {
        "no": "3",
        "name": "반납 입고 2",
        "actor": "지점 담당자",
        "api": "POST /v1/fsms/inventory/ceremonial-flags/receipts",
        "service": "CeremonialFlagInventoryService.createReturnReceipt",
        "description": "나갔던 근조기 2개가 돌아온다. QR 없이 수량을 직접 입력한다. 완료 상태의 입고 전표가 바로 만들어지고 현재고가 2 는다.",
        "note": "반납 합산은 완료된 입고 전표를 유형과 무관하게 전부 차감한다. 사용수량이 7에서 5로 줄고 현재고가 3에서 5로 는다.",
        "todo": "지금은 입고 전표만 만들고 InventoryStocks.qty 를 건드리지 않는다. 현재고를 qty 하나로 읽으려면 이 자리에 수량 증가가 붙어야 한다.",
        "derived": [
          [
            "현재고(qty)",
            "3 → 5"
          ],
          [
            "기준수량",
            "10"
          ],
          [
            "사용수량",
            "7 → 5"
          ]
        ],
        "operations": [
          {
            "table": "InventoryReceipts",
            "identifier": "RCP-1",
            "type": "INSERT",
            "values": {
              "receipt_id": "RCP-1",
              "company_id": "서울지점",
              "receipt_type": "RETURN",
              "status": "COMPLETED",
              "receipt_dt": "2026-08-20 13:00"
            }
          },
          {
            "table": "InventoryReceiptItems",
            "identifier": "RI-1",
            "type": "INSERT",
            "values": {
              "receipt_item_id": "RI-1",
              "receipt_id": "RCP-1",
              "item_cd": "B0201001",
              "inventory_type": "CONDOLENCE_FLAG",
              "qty": "2",
              "barcode": "null"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-1",
            "type": "UPDATE",
            "values": {
              "qty": "5"
            }
          }
        ]
      },
      {
        "no": "4",
        "name": "실사 시작",
        "actor": "지점 담당자",
        "api": "POST /v1/fsms/inventory/audits",
        "service": "InventoryAuditService.create",
        "description": "실사 1건과 품목 행이 생긴다. 이 시점의 현재고가 장부 수량으로 복사된다. QR 스캔 세션을 쓰지 않는다.",
        "note": "장부 수량(book_qty)에 InventoryStocks.qty 가 복사된다. 조사용품 실사와 같은 코드이고 같은 컬럼을 읽는다.",
        "derived": [
          [
            "현재고(qty)",
            "5"
          ],
          [
            "기준수량",
            "10"
          ],
          [
            "사용수량",
            "5"
          ],
          [
            "실사 품목의 book_qty",
            "5"
          ]
        ],
        "operations": [
          {
            "table": "InventoryAudits",
            "identifier": "AUD-1",
            "type": "INSERT",
            "values": {
              "inventory_audit_id": "AUD-1",
              "company_id": "서울지점",
              "inventory_type": "CONDOLENCE_FLAG",
              "status": "IN_PROGRESS",
              "audit_dt": "2026-08-20 15:00"
            }
          },
          {
            "table": "InventoryAuditItems",
            "identifier": "AI-1",
            "type": "INSERT",
            "values": {
              "inventory_audit_item_id": "AI-1",
              "inventory_audit_id": "AUD-1",
              "item_cd": "B0201001",
              "book_qty": "5",
              "actual_qty": "null",
              "diff_qty": "null"
            }
          }
        ]
      },
      {
        "no": "5",
        "name": "실사 수량 입력과 완료",
        "actor": "지점 담당자",
        "api": "PATCH /v1/fsms/inventory/audits/:id/items  ·  PATCH .../complete",
        "service": "InventoryAuditService.saveItems → complete",
        "description": "실제로 세어 3개를 입력한다. 편차는 실사수량에서 장부 수량을 뺀 -2 이고, 현재고가 실사값 3으로 맞춰진다.",
        "note": "조사용품 실사와 같은 처리다. 없어진 2개가 편차로 드러나고 현재고가 실물에 맞춰진다. 기준수량 10과 현재고 3의 차이 7은 채워야 할 양이다.",
        "todo": "지금은 근조기ㆍ축기에서 qty 를 덮지 않는다(inventory-audit.service.ts:145). 조사용품만 덮도록 유형 분기가 걸려 있어 그 분기를 지워야 한다.",
        "derived": [
          [
            "현재고(qty)",
            "5 → 3"
          ],
          [
            "기준수량",
            "10"
          ],
          [
            "사용수량",
            "5"
          ],
          [
            "실사수량",
            "3"
          ],
          [
            "재고편차",
            "-2"
          ],
          [
            "재고상태",
            "누락(SHORT)"
          ]
        ],
        "operations": [
          {
            "table": "InventoryAuditItems",
            "identifier": "AI-1",
            "type": "UPDATE",
            "values": {
              "actual_qty": "3",
              "diff_qty": "-2"
            }
          },
          {
            "table": "InventoryStocks",
            "identifier": "ST-1",
            "type": "UPDATE",
            "values": {
              "qty": "3"
            }
          },
          {
            "table": "InventoryAudits",
            "identifier": "AUD-1",
            "type": "UPDATE",
            "values": {
              "status": "COMPLETED"
            }
          }
        ]
      }
    ]
  }
]
