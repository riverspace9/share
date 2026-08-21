import { readFileSync } from 'node:fs'

describe('본부 탁송 비용 계산 문서', () => {
  it('필수 계산 기준과 미확정 정책 식별자를 포함한다', () => {
    const source = readFileSync('content/documents/flower-hq-consignment-fees.mdx', 'utf8')

    for (const required of [
      "legacy_bp_group IN ('M10','M20')",
      '25,000 + (계산단위수 - 1) × 10,000',
      "DLVY_ZONE1='1'",
      'null',
      '정상 0원',
      'A23',
      'C04',
    ]) {
      expect(source).toContain(required)
    }
  })
})
