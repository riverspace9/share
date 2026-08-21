import { readFileSync } from 'node:fs'

function getDeclarations(block: string) {
  return Object.fromEntries(
    [...block.matchAll(/(--[\w-]+)\s*:\s*([^;}]+);/g)].map(([, property, value]) => [
      property,
      value.trim(),
    ])
  )
}

function getRootBlock(css: string) {
  const block = css.match(/:root\s*\{([\s\S]*?)\}/)?.[1]

  expect(block).toBeDefined()
  return block ?? ''
}

function getDarkRootBlock(css: string) {
  const block = css.match(
    /@media\s*\(\s*prefers-color-scheme\s*:\s*dark\s*\)\s*\{\s*:root\s*\{([\s\S]*?)\}\s*\}/
  )?.[1]

  expect(block).toBeDefined()
  return block ?? ''
}

describe('문서 사이트 색상 토큰', () => {
  it('원본 문서의 라이트 의미 토큰 값을 제공한다', () => {
    const css = readFileSync('app/globals.css', 'utf8')
    const reference = readFileSync('reference/inventory-flow.html', 'utf8')
    const tokens = getDeclarations(getRootBlock(css))
    const sourceTokens = getDeclarations(getRootBlock(reference))

    expect(tokens).toMatchObject({
      '--background': sourceTokens['--bg'],
      '--card': sourceTokens['--card'],
      '--foreground': sourceTokens['--ink'],
      '--muted': sourceTokens['--accbg'],
      '--border': sourceTokens['--line'],
      '--primary': sourceTokens['--acc'],
      '--success': sourceTokens['--ok'],
      '--warning': sourceTokens['--warn'],
      '--destructive': sourceTokens['--todo'],
      '--accent': sourceTokens['--newbg'],
      '--card-foreground': 'var(--foreground)',
      '--input': 'var(--border)',
      '--ring': 'var(--primary)',
    })
  })

  it('원본 문서의 다크 의미 토큰 값을 dark media block에 제공한다', () => {
    const css = readFileSync('app/globals.css', 'utf8')
    const reference = readFileSync('reference/inventory-flow.html', 'utf8')
    const tokens = getDeclarations(getDarkRootBlock(css))
    const sourceTokens = getDeclarations(getDarkRootBlock(reference))

    expect(tokens).toMatchObject({
      '--background': sourceTokens['--bg'],
      '--card': sourceTokens['--card'],
      '--foreground': sourceTokens['--ink'],
      '--muted': sourceTokens['--accbg'],
      '--border': sourceTokens['--line'],
      '--primary': sourceTokens['--acc'],
      '--success': sourceTokens['--ok'],
      '--warning': sourceTokens['--warn'],
      '--destructive': sourceTokens['--todo'],
      '--accent': sourceTokens['--newbg'],
      '--card-foreground': 'var(--foreground)',
      '--input': 'var(--border)',
      '--ring': 'var(--primary)',
    })
  })

  it('토큰과 Tailwind dark 변형을 시스템 다크 모드로 함께 전환한다', () => {
    const css = readFileSync('app/globals.css', 'utf8')

    expect(css).toContain('@media (prefers-color-scheme: dark)')
    expect(css).not.toContain('@custom-variant dark')
  })
})
