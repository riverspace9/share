import * as React from 'react'

import { documentHref, documents } from '@/content/documents'

import { DocumentCard } from './document-card'

export function DocumentListPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">전달 문서</h1>
        <p className="text-muted-foreground">업무 기준과 설계 내용을 문서별로 확인합니다.</p>
      </header>

      <section aria-label="문서 목록" className="grid gap-4 md:grid-cols-2">
        {documents.map(({ meta }) => (
          <DocumentCard
            key={meta.slug}
            title={meta.title}
            summary={meta.summary}
            href={documentHref(meta.slug)}
            updatedAt={meta.updatedAt}
            tags={meta.tags}
          />
        ))}
      </section>
    </main>
  )
}
