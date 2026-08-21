import * as React from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'

import { InventoryFlowExplorer } from '@/features/inventory-flow/inventory-flow-explorer'

describe('재고 입출고 탐색기', () => {
  it('흐름과 단계를 바꾸고 현재 단계의 설명을 표시한다', () => {
    render(<InventoryFlowExplorer />)

    expect(screen.getAllByTestId('schema-table')).toHaveLength(16)

    fireEvent.click(screen.getByRole('tab', { name: /탁송/ }))
    fireEvent.click(screen.getByRole('button', { name: /3단계/ }))

    expect(screen.getByRole('heading', { name: '상차 품목 확인' })).toBeInTheDocument()
    expect(screen.getByText('POST /v1/fsms/partners/flower/orders/:id/item-verifications')).toBeInTheDocument()
    expect(screen.getByText(/InventoryTransferService\.reserveBarcode/)).toBeInTheDocument()
  })

  it('전체 흐름 행으로 단계를 선택하고 미구현 내용을 표시한다', () => {
    render(<InventoryFlowExplorer />)

    fireEvent.click(screen.getByRole('button', { name: '전체 흐름에서 4. 상품 출고 선택' }))

    expect(screen.getByRole('heading', { name: '상품 출고' })).toBeInTheDocument()
    expect(screen.getAllByText('미구현').length).toBeGreaterThan(0)
    expect(screen.getByText(/지금은 출고 전표를 만들지 않는다/)).toBeInTheDocument()
  })

  it('변경 테이블 이동과 위 정렬을 제공한다', () => {
    const scrollIntoView = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoView
    render(<InventoryFlowExplorer />)

    fireEvent.click(screen.getByRole('tab', { name: /탁송/ }))
    fireEvent.click(screen.getByRole('button', { name: /3단계/ }))
    fireEvent.click(screen.getByRole('button', { name: /InvTransferItemUnits 새 행 2/ }))

    expect(scrollIntoView).toHaveBeenCalledOnce()

    fireEvent.click(screen.getByLabelText('바뀐 테이블을 맨 위로 모으기'))
    expect(screen.getAllByTestId('schema-table')[0]).toHaveTextContent(/변경/)
  })

  it('같은 식별자를 클릭하면 모든 일치 값을 강조한다', () => {
    render(<InventoryFlowExplorer />)

    fireEvent.click(screen.getByRole('tab', { name: /탁송/ }))
    fireEvent.click(screen.getByRole('button', { name: /3단계/ }))

    const identifiers = screen.getAllByRole('button', { name: 'TI-1' })
    fireEvent.click(identifiers[0])

    for (const identifier of screen.getAllByRole('button', { name: 'TI-1' })) {
      expect(identifier).toHaveAttribute('aria-pressed', 'true')
    }
  })

  it('수량 재고의 현재고, 기준수량, 사용수량 설명을 표시한다', () => {
    render(<InventoryFlowExplorer />)

    fireEvent.click(screen.getByRole('tab', { name: /근조기ㆍ축기/ }))

    const scenario = screen.getByTestId('inventory-scenario')
    expect(within(scenario).getByText(/현재고 = InventoryStocks\.qty/)).toBeInTheDocument()
    expect(within(scenario).getByText(/기준수량 = base_qty/)).toBeInTheDocument()
    expect(within(scenario).getByText(/사용수량 = 확정 출고 합/)).toBeInTheDocument()
  })
})
