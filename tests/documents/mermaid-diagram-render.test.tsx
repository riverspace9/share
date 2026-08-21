import * as React from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const { initialize, renderMermaid } = vi.hoisted(() => ({
  initialize: vi.fn(),
  renderMermaid: vi.fn(),
}))

vi.mock('mermaid', () => ({
  default: {
    initialize,
    render: renderMermaid,
  },
}))

import { MermaidDiagram } from '@/components/documents/mermaid-diagram'

const mediaListeners = new Set<(event: MediaQueryListEvent) => void>()
let prefersDark = false

const mediaQuery = {
  get matches() {
    return prefersDark
  },
  media: '(prefers-color-scheme: dark)',
  onchange: null,
  addListener: vi.fn(),
  removeListener: vi.fn(),
  addEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
    if (type === 'change' && typeof listener === 'function') {
      mediaListeners.add(listener as (event: MediaQueryListEvent) => void)
    }
  }),
  removeEventListener: vi.fn((type: string, listener: EventListenerOrEventListenerObject) => {
    if (type === 'change' && typeof listener === 'function') {
      mediaListeners.delete(listener as (event: MediaQueryListEvent) => void)
    }
  }),
  dispatchEvent: vi.fn(),
} as unknown as MediaQueryList

function notifyColorSchemeChange() {
  for (const listener of mediaListeners) {
    listener(new Event('change') as MediaQueryListEvent)
  }
}

describe('MermaidDiagram 렌더링', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    prefersDark = false
    mediaListeners.clear()
    initialize.mockReset()
    renderMermaid.mockReset().mockResolvedValue({
      svg: '<svg width="100%" style="max-width: 960px;"><title>계산 흐름</title></svg>',
    })
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: vi.fn(() => mediaQuery),
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      configurable: true,
      value: originalMatchMedia,
    })
  })

  it('초기화와 렌더링 결과 SVG의 자연 너비를 반응형 레이아웃에 전달한다', async () => {
    render(<MermaidDiagram title="계산 흐름" code={'flowchart LR\nA-->B'} />)

    await waitFor(() => expect(renderMermaid).toHaveBeenCalledTimes(1))

    expect(initialize).toHaveBeenCalledWith({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'default',
    })
    const svg = screen.getByRole('img', { name: '계산 흐름' }).querySelector('svg')
    expect(svg?.style.getPropertyValue('--mermaid-natural-width')).toBe('960px')
    expect(svg).not.toHaveStyle({ maxWidth: 'none', width: '960px' })
  })

  it('넓은 다이어그램을 위한 가로 스크롤 영역을 제공한다', async () => {
    render(<MermaidDiagram title="계산 흐름" code={'flowchart LR\nA-->B'} />)

    await waitFor(() => expect(renderMermaid).toHaveBeenCalledTimes(1))

    const viewport = screen.getByRole('img', { name: '계산 흐름' }).closest(
      '[data-slot="scroll-area-viewport"]'
    )
    expect(viewport).toHaveStyle({ overflowX: 'scroll' })
  })

  it('렌더링이 실패하면 오류와 원문을 표시한다', async () => {
    const code = 'flowchart LR\nA-->'
    renderMermaid.mockRejectedValueOnce(new Error('Mermaid 문법 오류'))

    render(<MermaidDiagram title="계산 흐름" code={code} />)

    const alert = await screen.findByRole('alert')
    expect(alert).toHaveTextContent('Mermaid 문법 오류')
    expect(alert.querySelector('pre')?.textContent).toBe(code)
  })

  it('여러 다이어그램에 서로 다른 Mermaid 렌더링 ID를 사용한다', async () => {
    render(
      <>
        <MermaidDiagram title="입고 흐름" code={'flowchart LR\nA-->B'} />
        <MermaidDiagram title="출고 흐름" code={'flowchart LR\nC-->D'} />
      </>
    )

    await waitFor(() => expect(renderMermaid).toHaveBeenCalledTimes(2))

    const renderIds = renderMermaid.mock.calls.map(([id]) => id)
    expect(new Set(renderIds).size).toBe(2)
  })

  it('시스템 색상 모드가 바뀌면 dark 테마로 다시 초기화하고 렌더링한다', async () => {
    render(<MermaidDiagram title="계산 흐름" code={'flowchart LR\nA-->B'} />)

    await waitFor(() => expect(renderMermaid).toHaveBeenCalledTimes(1))

    prefersDark = true
    act(() => notifyColorSchemeChange())

    await waitFor(() => expect(renderMermaid).toHaveBeenCalledTimes(2))
    expect(initialize).toHaveBeenLastCalledWith({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: 'dark',
    })
  })
})
