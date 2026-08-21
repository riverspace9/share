import * as React from 'react'
import { render, screen } from '@testing-library/react'

import { DocumentListPage } from '@/components/documents/document-list-page'

describe('문서 목록', () => {
  it('등록된 문서 카드를 표시한다', () => {
    render(<DocumentListPage />)

    expect(screen.getAllByRole('link')).toHaveLength(2)
    expect(screen.getByText('재고 입출고 흐름')).toBeInTheDocument()
    expect(screen.getByText('본부 탁송 비용 계산')).toBeInTheDocument()
  })
})
