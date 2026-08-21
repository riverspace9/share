import * as React from 'react'
import { render, screen } from '@testing-library/react'
import { vi } from 'vitest'

vi.mock('mermaid', () => ({}))

import { MermaidDiagram } from '@/components/documents/mermaid-diagram'

describe('MermaidDiagram', () => {
  it('Mermaid를 불러오지 못하면 원문과 오류를 표시한다', async () => {
    render(<MermaidDiagram title="계산 흐름" code={'flowchart LR\nA-->B'} />)

    expect(await screen.findByRole('alert')).toHaveTextContent('flowchart LR')
  })
})
