declare module '*.mdx' {
  import type { ComponentType } from 'react'

  import type { DocumentMeta } from '@/content/document.types'

  const MDXContent: ComponentType

  export const documentMeta: DocumentMeta
  export default MDXContent
}
