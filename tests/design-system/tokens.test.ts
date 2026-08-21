import { readFileSync } from 'node:fs'

describe('문서 사이트 색상 토큰', () => {
  it('기존 문서의 핵심 의미 토큰을 라이트와 다크 테마에 제공한다', () => {
    const css = readFileSync('app/globals.css', 'utf8')

    for (const token of [
      '--background',
      '--card',
      '--foreground',
      '--primary',
      '--success',
      '--warning',
    ]) {
      expect(css.match(new RegExp(token, 'g'))?.length ?? 0).toBeGreaterThanOrEqual(2)
    }
  })
})
