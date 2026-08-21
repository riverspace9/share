import * as React from 'react'
import { render, screen, within } from '@testing-library/react'

import FlowerHqConsignmentFeesDocument from '@/content/documents/flower-hq-consignment-fees.mdx'

describe('본부 탁송 비용 계산 문서', () => {
  it('상차 탁송비와 하차 배송비의 저장 주문 책임을 구분한다', () => {
    render(<FlowerHqConsignmentFeesDocument />)

    expect(screen.getByRole('row', { name: /탁송비 탁송 상차 주문/ })).toBeInTheDocument()
    expect(
      screen.getByRole('row', { name: /배송비 일반배송 주문 또는 탁송 하차 주문/ })
    ).toBeInTheDocument()
  })

  it('확정 네 건과 확인 대기 네 건을 상태별로 표시한다', () => {
    render(<FlowerHqConsignmentFeesDocument />)

    expect(screen.getAllByText('확정')).toHaveLength(4)
    expect(screen.getAllByText('확인 대기')).toHaveLength(4)
  })

  it('본부 요율 우선과 공통 요율 fallback을 확정 정책으로 표시한다', () => {
    render(<FlowerHqConsignmentFeesDocument />)

    const rateRow = screen.getByRole('row', { name: /요율 선택 순서/ })
    expect(within(rateRow).getByText('확정')).toBeInTheDocument()
    expect(rateRow).toHaveTextContent("BP_CD='*'")
  })

  it('추가 품목군 전체를 확인 대기 정책으로 표시한다', () => {
    render(<FlowerHqConsignmentFeesDocument />)

    const itemRow = screen.getByRole('row', { name: /추가 품목군/ })
    expect(within(itemRow).getByText('확인 대기')).toBeInTheDocument()
    expect(itemRow).toHaveTextContent('A23ㆍE31ㆍF10ㆍF20')
  })

  it('미산정과 정상 0원을 구분하고 C04 가격을 확인 대기로 둔다', () => {
    render(<FlowerHqConsignmentFeesDocument />)

    expect(screen.getByText(/null은 미산정이고 0은 정상 0원/)).toBeInTheDocument()
    const c04Row = screen.getByRole('row', { name: /C04 가격/ })
    expect(within(c04Row).getByText('확인 대기')).toBeInTheDocument()
    expect(c04Row).toHaveTextContent('무료로 간주하지 않고')
  })
})
