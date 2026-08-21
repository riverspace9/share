import * as React from 'react'
import { render, screen } from '@testing-library/react'
import mermaid from 'mermaid'

import { diagrams } from '@/content/diagrams'
import { MermaidDiagram } from '@/components/documents'

describe('MermaidDiagram', () => {
  it('다이어그램 제목을 접근 가능한 이름으로 노출한다', () => {
    render(<MermaidDiagram title="계산 흐름" code={'flowchart LR\nA-->B'} />)

    expect(screen.getByLabelText('계산 흐름')).toBeInTheDocument()
  })
})

describe('등록 다이어그램', () => {
  it('브라우저 배포 전에 모든 Mermaid 원문을 해석한다', async () => {
    for (const code of Object.values(diagrams)) {
      await expect(mermaid.parse(code)).resolves.toBeTruthy()
    }
  })

  it('두 문서에서 사용하는 다섯 다이어그램을 모두 등록한다', () => {
    expect(Object.keys(diagrams)).toEqual([
      'inventoryFlowDiagram',
      'inventoryHeaderItemDiagram',
      'inventoryTransferBoundaryDiagram',
      'consignmentFeeDiagram',
      'deliveryFeeLookupDiagram',
    ])
  })

  it('다이어그램 원문에 raw 색상을 사용하지 않는다', () => {
    for (const code of Object.values(diagrams)) {
      expect(code).not.toMatch(/#[0-9a-f]{3,8}/i)
    }
  })
})
