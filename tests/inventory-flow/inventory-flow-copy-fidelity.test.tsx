import { readFileSync } from 'node:fs'
import * as React from 'react'
import { render } from '@testing-library/react'

import InventoryFlowDocument from '@/content/documents/inventory-flow.mdx'
import { inventoryFlows } from '@/features/inventory-flow/inventory-flow.data'

function normalizeText(value: string | null | undefined) {
  return (value ?? '').replace(/\s+/g, ' ').trim()
}

function extractTable(table: Element) {
  return {
    columns: [...table.querySelectorAll('thead th')].map((cell) => normalizeText(cell.textContent)),
    rows: [...table.querySelectorAll('tbody tr')].map((row) => (
      [...row.querySelectorAll('td')].map((cell) => ({
        content: normalizeText(cell.textContent),
        colSpan: Number(cell.getAttribute('colspan') ?? '1'),
      }))
    )),
  }
}

function siblingsBetween(start: Element, end: Element) {
  const nodes: Element[] = []
  let current = start.nextElementSibling

  while (current && current !== end) {
    nodes.push(current)
    current = current.nextElementSibling
  }

  return nodes
}

function elementsWithin(nodes: Element[], selector: string) {
  return nodes.flatMap((node) => [
    ...(node.matches(selector) ? [node] : []),
    ...node.querySelectorAll(selector),
  ])
}

describe('재고 문서 원문 문체 보존', () => {
  const reference = new DOMParser().parseFromString(
    readFileSync('reference/inventory-flow.html', 'utf8'),
    'text/html'
  )

  it('상단 안내와 원칙 문장을 이전 HTML 그대로 표시한다', () => {
    const { container } = render(<InventoryFlowDocument />)
    const intro = container.querySelector(':scope > p')
    const principle = container.querySelector(':scope > [role="alert"]')

    expect(normalizeText(intro?.textContent)).toBe(normalizeText(reference.querySelector('.sub')?.textContent))
    expect(normalizeText(principle?.textContent)).toBe(
      normalizeText(reference.querySelector('.principle')?.textContent)
    )
  })

  it('개념 설명의 소제목, 문단, 표를 이전 HTML 원문으로 보존한다', () => {
    const { container } = render(<InventoryFlowDocument />)
    const headings = [...container.querySelectorAll('h2')]
    const conceptHeading = headings.find((heading) => heading.textContent === '1. 개념')
    const flowHeading = headings.find((heading) => heading.textContent === '2. 흐름 탐색')

    expect(conceptHeading).toBeDefined()
    expect(flowHeading).toBeDefined()

    const currentNodes = siblingsBetween(conceptHeading!, flowHeading!)
    const legacyConcept = reference.querySelector('.cpt')
    const currentHeadings = elementsWithin(currentNodes, 'h3').map((node) => normalizeText(node.textContent))
    const legacyHeadings = [...(legacyConcept?.querySelectorAll('.cptq') ?? [])]
      .map((node) => normalizeText(node.textContent))
    const currentProse = currentNodes
      .filter((node) => node.matches('p, [role="alert"]'))
      .map((node) => normalizeText(node.textContent))
    const legacyProse = [...(legacyConcept?.children ?? [])]
      .filter((node) => node.matches('p, .todo'))
      .map((node) => normalizeText(node.textContent))
    const currentTables = elementsWithin(currentNodes, 'table').map(extractTable)
    const legacyTables = [...(legacyConcept?.querySelectorAll('table') ?? [])].map(extractTable)

    expect(currentHeadings).toEqual(legacyHeadings)
    expect(currentProse).toEqual(legacyProse)
    expect(currentTables).toEqual(legacyTables)
    expect(elementsWithin(currentNodes, 'ul')).toHaveLength(0)
  })

  it('이전 HTML에서 화면에 표시하지 않던 흐름 요약을 추가로 노출하지 않는다', () => {
    const { container } = render(<InventoryFlowDocument />)

    expect(container).not.toHaveTextContent(inventoryFlows[0].description)
  })

  it('미구현 설명 제목을 이전 HTML 원문으로 표시한다', () => {
    const { container } = render(<InventoryFlowDocument />)

    expect(container).toHaveTextContent('아직 구현되지 않았다')
  })

  it('상태 값 아래 설명 네 문단을 이전 HTML 원문으로 보존한다', () => {
    const { container } = render(<InventoryFlowDocument />)
    const stateHeading = [...container.querySelectorAll('h2')]
      .find((heading) => heading.textContent === '상태 값')

    expect(stateHeading).toBeDefined()

    const currentParagraphs: string[] = []
    let current = stateHeading!.nextElementSibling
    while (current) {
      if (current.matches('p')) currentParagraphs.push(normalizeText(current.textContent))
      current = current.nextElementSibling
    }

    const legacyFoot = reference.querySelector('.foot')
    const legacyParagraphs = (legacyFoot?.innerHTML ?? '')
      .split(/<br\s*\/?>(?:\s|&nbsp;)*<br\s*\/?>/i)
      .slice(1)
      .map((fragment) => normalizeText(
        new DOMParser().parseFromString(`<body>${fragment}</body>`, 'text/html').body.textContent
      ))

    expect(currentParagraphs.slice(1)).toEqual(legacyParagraphs)
  })
})
