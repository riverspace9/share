import {
  documentMeta as flowerHqConsignmentFeesMeta,
} from '@/content/documents/flower-hq-consignment-fees.mdx'
import { documentMeta as inventoryFlowMeta } from '@/content/documents/inventory-flow.mdx'

import type { DocumentDefinition, DocumentMeta } from '@/content/document.types'

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
const datePattern = /^(\d{4})-(\d{2})-(\d{2})$/

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function requireNonEmptyString(meta: Record<string, unknown>, field: keyof DocumentMeta) {
  const value = meta[field]

  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new Error(`문서 메타데이터 ${field}은 비어 있지 않은 문자열이어야 합니다.`)
  }

  return value
}

function isRealDate(value: string) {
  const match = datePattern.exec(value)
  if (!match || Number(match[1]) < 1) {
    return false
  }

  const date = new Date(`${value}T00:00:00.000Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

export function validateDocumentMetadata(
  metadata: readonly unknown[]
): asserts metadata is readonly DocumentMeta[] {
  const slugs = new Set<string>()

  for (const [index, value] of metadata.entries()) {
    if (!isRecord(value)) {
      throw new Error(`문서 메타데이터 ${index + 1}번 항목은 객체여야 합니다.`)
    }

    const slug = requireNonEmptyString(value, 'slug')
    requireNonEmptyString(value, 'title')
    requireNonEmptyString(value, 'summary')
    const updatedAt = requireNonEmptyString(value, 'updatedAt')

    if (!slugPattern.test(slug)) {
      throw new Error(`문서 메타데이터 slug 형식이 잘못됐습니다: ${slug}`)
    }
    if (slugs.has(slug)) {
      throw new Error(`중복 문서 slug입니다: ${slug}`)
    }
    slugs.add(slug)

    if (typeof value.order !== 'number' || !Number.isFinite(value.order)) {
      throw new Error(`문서 메타데이터 order는 유한수여야 합니다: ${slug}`)
    }

    if (
      !Array.isArray(value.tags) ||
      value.tags.length === 0 ||
      value.tags.some((tag) => typeof tag !== 'string' || tag.trim().length === 0)
    ) {
      throw new Error(`문서 메타데이터 tags는 비어 있지 않은 문자열 목록이어야 합니다: ${slug}`)
    }

    if (!isRealDate(updatedAt)) {
      throw new Error(`문서 메타데이터 updatedAt은 실제 YYYY-MM-DD 날짜여야 합니다: ${slug}`)
    }
  }
}

const documentDefinitions = [
  {
    meta: inventoryFlowMeta,
    load: () => import('@/content/documents/inventory-flow.mdx'),
  },
  {
    meta: flowerHqConsignmentFeesMeta,
    load: () => import('@/content/documents/flower-hq-consignment-fees.mdx'),
  },
] satisfies readonly DocumentDefinition[]

validateDocumentMetadata(documentDefinitions.map((document) => document.meta))

export const documents = [...documentDefinitions].sort(
  (left, right) => left.meta.order - right.meta.order
)

export function findDocument(slug: string) {
  return documents.find((document) => document.meta.slug === slug)
}

export function documentHref(slug: string) {
  return `/documents/${slug}/`
}
