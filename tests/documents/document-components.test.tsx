import * as React from 'react'
import { render, screen } from '@testing-library/react'

import {
  Callout,
  DataTable,
  DecisionTable,
  FormulaCard,
  SourceReference,
} from '@/components/documents'

describe('문서 구성 요소', () => {
  it('계산식 카드에 계산식과 예시 결과를 표시한다', () => {
    render(
      <FormulaCard
        title="탁송비"
        formula="25,000 + (수량 - 1) × 10,000"
        examples={[["2개", "35,000원"]]}
      />
    )

    expect(screen.getByRole('heading', { name: '탁송비' })).toBeInTheDocument()
    expect(screen.getByText('35,000원')).toBeInTheDocument()
  })

  it('안내 내용을 경고 역할로 표시한다', () => {
    render(
      <Callout variant="warning" title="확인 필요">
        배송지 변경은 출고 전에만 가능합니다.
      </Callout>
    )

    expect(screen.getByRole('alert')).toHaveTextContent('확인 필요')
    expect(screen.getByRole('alert')).toHaveTextContent('배송지 변경은 출고 전에만 가능합니다.')
  })

  it('표 머리글과 행 데이터를 표시한다', () => {
    render(
      <DataTable
        columns={['구분', '금액']}
        rows={[["기본 탁송비", "25,000원"]]}
      />
    )

    expect(screen.getByRole('columnheader', { name: '구분' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: '25,000원' })).toBeInTheDocument()
  })

  it('결정 표에서 확정과 확인 대기 상태를 구분해 표시한다', () => {
    render(
      <DecisionTable
        rows={[
          { item: '기본 탁송비', status: 'CONFIRMED', detail: '25,000원' },
          { item: '도서 산간 추가 비용', status: 'PENDING', detail: '운영 확인 필요' },
        ]}
      />
    )

    expect(screen.getByText('확정')).toBeInTheDocument()
    expect(screen.getByText('확인 대기')).toBeInTheDocument()
  })

  it('출처 링크와 설명을 표시한다', () => {
    render(
      <SourceReference
        title="운영 기준"
        href="https://example.com/operations"
        description="2026년 8월 운영 기준"
      />
    )

    expect(screen.getByRole('link', { name: '운영 기준' })).toHaveAttribute(
      'href',
      'https://example.com/operations'
    )
    expect(screen.getByText('2026년 8월 운영 기준')).toBeInTheDocument()
  })
})
