'use client'

import * as React from 'react'
import { useEffect, useId, useState } from 'react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { ScrollArea } from '@/components/ui/scroll-area'

export interface MermaidDiagramProps {
  title: string
  code: string
}

type MermaidTheme = 'default' | 'dark'

let mermaidModule: Promise<typeof import('mermaid')> | undefined

function loadMermaid() {
  mermaidModule ??= import('mermaid')
  return mermaidModule
}

function getMermaidTheme(): MermaidTheme {
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'default'
}

export function MermaidDiagram({ title, code }: MermaidDiagramProps) {
  const id = useId().replace(/:/g, '')
  const [theme, setTheme] = useState<MermaidTheme>('default')
  const [svg, setSvg] = useState<string>()
  const [error, setError] = useState<string>()

  useEffect(() => {
    const mediaQuery = window.matchMedia?.('(prefers-color-scheme: dark)')
    const updateTheme = () => setTheme(getMermaidTheme())

    updateTheme()
    mediaQuery?.addEventListener('change', updateTheme)

    return () => mediaQuery?.removeEventListener('change', updateTheme)
  }, [])

  useEffect(() => {
    let active = true

    async function renderDiagram() {
      setSvg(undefined)
      setError(undefined)

      try {
        const { default: mermaid } = await loadMermaid()
        mermaid.initialize({ startOnLoad: false, securityLevel: 'strict', theme })
        const { svg: renderedSvg } = await mermaid.render(`mermaid-${id}`, code)
        if (active) {
          setSvg(renderedSvg)
        }
      } catch (renderError) {
        if (active) {
          setError(renderError instanceof Error ? renderError.message : '다이어그램을 렌더링하지 못했습니다.')
        }
      }
    }

    void renderDiagram()

    return () => {
      active = false
    }
  }, [code, id, theme])

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>{title} 다이어그램을 표시하지 못했습니다</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
        <pre className="overflow-x-auto rounded-md bg-muted p-3 font-mono text-xs text-foreground">{code}</pre>
      </Alert>
    )
  }

  return (
    <ScrollArea className="w-full rounded-lg border bg-card">
      <div
        aria-label={title}
        aria-busy={svg ? undefined : true}
        className="min-w-max p-4 [&_svg]:h-auto [&_svg]:max-w-none"
        dangerouslySetInnerHTML={svg ? { __html: svg } : undefined}
        role="img"
      />
    </ScrollArea>
  )
}
