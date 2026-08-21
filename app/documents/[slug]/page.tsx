import * as React from 'react'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { DocumentLayout } from '@/components/documents/document-layout'
import { documents, findDocument } from '@/content/documents'

interface DocumentPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return documents.map(({ meta }) => ({ slug: meta.slug }))
}

export async function generateMetadata({ params }: DocumentPageProps): Promise<Metadata> {
  const document = findDocument((await params).slug)

  if (!document) {
    return {}
  }

  return {
    title: document.meta.title,
    description: document.meta.summary,
  }
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const document = findDocument((await params).slug)

  if (!document) {
    notFound()
  }

  const { default: DocumentContent } = await document.load()

  return (
    <DocumentLayout {...document.meta}>
      <DocumentContent />
    </DocumentLayout>
  )
}
