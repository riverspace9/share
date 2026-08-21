import * as React from 'react'
import { render, screen } from '@testing-library/react'

import NotFound from '@/app/not-found'

describe('문서 없음 화면', () => {
  it('문서 목록으로 돌아갈 수 있게 안내한다', () => {
    render(<NotFound />)

    expect(screen.getByRole('heading', { name: '문서를 찾을 수 없습니다' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '문서 목록' })).toHaveAttribute('href', '/')
  })
})
