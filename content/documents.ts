import {
  documentMeta as flowerHqConsignmentFeesMeta,
} from '@/content/documents/flower-hq-consignment-fees.mdx'
import { documentMeta as inventoryFlowMeta } from '@/content/documents/inventory-flow.mdx'

import type { DocumentDefinition } from '@/content/document.types'

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

export const documents = [...documentDefinitions].sort(
  (left, right) => left.meta.order - right.meta.order
)

export function findDocument(slug: string) {
  return documents.find((document) => document.meta.slug === slug)
}

export function documentHref(slug: string) {
  return `/documents/${slug}/`
}
