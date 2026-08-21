import { documentHref, documents, findDocument } from '@/content/documents'

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
})
