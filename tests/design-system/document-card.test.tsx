import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('next/link', () => ({
  default: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a data-next-link="true" href={`/share${href}`}>
      {children}
    </a>
  ),
}))

import { DocumentCard } from '@/components/documents/document-card'
import { DocumentLayout } from '@/components/documents/document-layout'

describe('DocumentCard', () => {
  it('제목 링크에 Next basePath를 적용한다', () => {
    render(
      <DocumentCard
        title="본부 탁송 비용 계산"
        summary="상차와 하차 비용 기준"
        href="/documents/fee/"
        updatedAt="2026-08-21"
        tags={['탁송']}
      />
    )

    expect(screen.getByRole('link', { name: /본부 탁송 비용 계산/ })).toHaveAttribute(
      'href',
      '/share/documents/fee/'
    )
    expect(screen.getByRole('link', { name: /본부 탁송 비용 계산/ })).toHaveAttribute(
      'data-next-link',
      'true'
    )
  })
})

describe('DocumentLayout', () => {
  it('문서 제목과 태그를 표시한다', () => {
    render(
      <DocumentLayout
        title="재고 입출고 흐름"
        summary="재고 이동 상태와 기준"
        updatedAt="2026-08-21"
        tags={['재고', '입출고']}
      >
        <p>문서 본문</p>
      </DocumentLayout>
    )

    expect(screen.getByRole('heading', { name: '재고 입출고 흐름' })).toBeVisible()
    expect(screen.getByText('재고')).toBeVisible()
    expect(screen.getByText('문서 본문')).toBeVisible()
  })
})
