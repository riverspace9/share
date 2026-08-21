import type { ComponentType } from 'react'

export interface DocumentMeta {
  slug: string
  title: string
  summary: string
  updatedAt: string
  order: number
  tags: readonly string[]
}

export interface DocumentDefinition {
  meta: DocumentMeta
  load: () => Promise<{ default: ComponentType }>
}
