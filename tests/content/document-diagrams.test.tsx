import * as React from 'react'
import { render, screen } from '@testing-library/react'

import FlowerHqConsignmentFeesDocument from '@/content/documents/flower-hq-consignment-fees.mdx'
import InventoryFlowDocument from '@/content/documents/inventory-flow.mdx'

describe('문서 다이어그램 구성', () => {
  it('재고 문서에 원본 다이어그램 세 개를 렌더링한다', () => {
    render(<InventoryFlowDocument />)

    expect(screen.getAllByRole('img')).toHaveLength(3)
    expect(screen.getByRole('img', { name: '헤더와 품목 행 관계' })).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: '회사 사이 이동과 출고ㆍ입고 전표 관계' })
    ).toBeInTheDocument()
  })

  it('비용 문서에 등록된 다이어그램 두 개를 렌더링한다', () => {
    render(<FlowerHqConsignmentFeesDocument />)

    expect(screen.getAllByRole('img')).toHaveLength(2)
  })
})
