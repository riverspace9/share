import {
  documentHref,
  documents,
  findDocument,
  validateDocumentMetadata,
} from '@/content/documents'

const validDocumentMeta = {
  slug: 'example-document',
  title: '예시 문서',
  summary: '검증에 사용하는 문서',
  updatedAt: '2026-08-21',
  order: 10,
  tags: ['예시'],
}

describe('문서 레지스트리', () => {
  it('문서 목록을 표시 순서로 제공한다', () => {
    expect(documents.map((document) => document.meta.slug)).toEqual([
      'inventory-flow',
      'flower-hq-consignment-fees',
    ])
  })

  it('중복되지 않는 slug로 문서와 경로를 찾는다', () => {
    expect(new Set(documents.map((document) => document.meta.slug)).size).toBe(documents.length)
    expect(findDocument('inventory-flow')?.meta.title).toBe('재고 입출고 흐름')
    expect(findDocument('missing-document')).toBeUndefined()
    expect(documentHref('inventory-flow')).toBe('/documents/inventory-flow/')
  })

  it('JSX를 포함한 실제 MDX 문서 모듈을 불러온다', async () => {
    const document = findDocument('inventory-flow')
    const documentModule = await document?.load()

    expect(documentModule?.documentMeta.slug).toBe('inventory-flow')
    expect(documentModule?.default).toEqual(expect.any(Function))
  })

  it('필수 메타데이터 필드가 빠지면 등록을 거부한다', () => {
    const missingSummary = {
      slug: validDocumentMeta.slug,
      title: validDocumentMeta.title,
      updatedAt: validDocumentMeta.updatedAt,
      order: validDocumentMeta.order,
      tags: validDocumentMeta.tags,
    }

    expect(() => validateDocumentMetadata([missingSummary])).toThrow(/summary/)
  })

  it('필수 문자열이 비어 있으면 등록을 거부한다', () => {
    expect(() =>
      validateDocumentMetadata([{ ...validDocumentMeta, title: '   ' }])
    ).toThrow(/title/)
  })

  it('비어 있거나 형식이 잘못된 slug를 거부한다', () => {
    expect(() => validateDocumentMetadata([{ ...validDocumentMeta, slug: '' }])).toThrow(/slug/)
    expect(() =>
      validateDocumentMetadata([{ ...validDocumentMeta, slug: 'Example Document' }])
    ).toThrow(/slug/)
  })

  it('중복 slug를 거부한다', () => {
    expect(() => validateDocumentMetadata([validDocumentMeta, { ...validDocumentMeta }])).toThrow(
      /중복.*example-document/
    )
  })

  it('유한수가 아닌 표시 순서를 거부한다', () => {
    expect(() =>
      validateDocumentMetadata([{ ...validDocumentMeta, order: Number.NaN }])
    ).toThrow(/order/)
    expect(() =>
      validateDocumentMetadata([{ ...validDocumentMeta, order: Number.POSITIVE_INFINITY }])
    ).toThrow(/order/)
  })

  it('비어 있거나 잘못된 tag 목록을 거부한다', () => {
    expect(() => validateDocumentMetadata([{ ...validDocumentMeta, tags: [] }])).toThrow(/tags/)
    expect(() => validateDocumentMetadata([{ ...validDocumentMeta, tags: ['예시', ' '] }])).toThrow(/tags/)
  })

  it('YYYY-MM-DD 형식이 아니거나 실제로 존재하지 않는 날짜를 거부한다', () => {
    expect(() =>
      validateDocumentMetadata([{ ...validDocumentMeta, updatedAt: '2026-8-21' }])
    ).toThrow(/updatedAt/)
    expect(() =>
      validateDocumentMetadata([{ ...validDocumentMeta, updatedAt: '2026-02-30' }])
    ).toThrow(/updatedAt/)
  })
})
