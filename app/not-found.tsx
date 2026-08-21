import * as React from 'react'
import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-4 px-4 py-8">
      <h1 className="text-3xl font-semibold tracking-tight">문서를 찾을 수 없습니다</h1>
      <p className="text-muted-foreground">요청한 문서가 없거나 이동되었습니다.</p>
      <div>
        <Link className="text-primary hover:underline" href="/">
          문서 목록
        </Link>
      </div>
    </main>
  )
}
