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
    HTMLElement.prototype.scrollIntoView = vi.fn()
    render(<InventoryFlowExplorer />)

    fireEvent.click(screen.getByRole('row', { name: /4\. 상품 출고.*협력사 담당자/ }))

    expect(screen.getByRole('heading', { name: '상품 출고' })).toBeInTheDocument()
    expect(screen.getAllByText('미구현').length).toBeGreaterThan(0)
    expect(screen.getByText(/지금은 출고 전표를 만들지 않는다/)).toBeInTheDocument()
  })

  it('전체 흐름의 담당자 셀을 눌러 단계를 선택하고 표 위치로 이동한다', () => {
    const scrollIntoView = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoView
    render(<InventoryFlowExplorer />)

    const row = screen.getByRole('row', { name: /4\. 상품 출고.*협력사 담당자/ })
    fireEvent.click(within(row).getByRole('cell', { name: '협력사 담당자' }))

    expect(screen.getByRole('heading', { name: '상품 출고' })).toBeInTheDocument()
    expect(scrollIntoView).toHaveBeenCalledOnce()
  })

  it('전체 흐름 행을 키보드로 선택하고 표 위치로 이동한다', () => {
    const scrollIntoView = vi.fn()
    HTMLElement.prototype.scrollIntoView = scrollIntoView
    render(<InventoryFlowExplorer />)

    const enterRow = screen.getByRole('row', { name: /4\. 상품 출고.*협력사 담당자/ })
    const spaceRow = screen.getByRole('row', { name: /5\. 배송 완료.*협력사 담당자/ })
    expect(enterRow).toHaveAttribute('tabindex', '0')

    fireEvent.keyDown(enterRow, { key: 'Enter' })
    expect(screen.getByRole('heading', { name: '상품 출고' })).toBeInTheDocument()

    fireEvent.keyDown(spaceRow, { key: ' ' })
    expect(screen.getByRole('heading', { name: '배송 완료' })).toBeInTheDocument()
    expect(scrollIntoView).toHaveBeenCalledTimes(2)
  })

  it('시나리오 비교표의 공통 값을 두 열에 걸쳐 표시한다', () => {
    render(<InventoryFlowExplorer />)

    fireEvent.click(screen.getByRole('tab', { name: '물류센터 입고' }))
    expect(screen.getByRole('cell', { name: '같다. 지점이 찍고 입고를 완료할 때' })).toHaveAttribute(
      'colspan',
      '2'
    )
    expect(screen.getByRole('cell', { name: '같다. 입고 스캔 세션 하나를 쓴다' })).toHaveAttribute(
      'colspan',
      '2'
    )

    fireEvent.click(screen.getByRole('tab', { name: /근조기ㆍ축기/ }))
    expect(screen.getByRole('cell', { name: '같다. InventoryStocks.qty' })).toHaveAttribute('colspan', '2')
    expect(screen.getByRole('cell', { name: '같다. qty - reserved_qty' })).toHaveAttribute('colspan', '2')
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
