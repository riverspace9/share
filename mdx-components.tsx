import type * as React from 'react'
import type { MDXComponents } from 'mdx/types'

import {
  Callout,
  DataTable,
  DecisionTable,
  FormulaCard,
  MermaidDiagram,
  SourceReference,
} from '@/components/documents'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Table } from '@/components/ui/table'

export function useMDXComponents(components: MDXComponents = {}): MDXComponents {
  return {
    h1: (props: React.ComponentProps<'h1'>) => (
      <h1 className="text-3xl font-semibold tracking-tight" {...props} />
    ),
    h2: (props: React.ComponentProps<'h2'>) => (
      <h2 className="mt-8 text-2xl font-semibold tracking-tight" {...props} />
    ),
    h3: (props: React.ComponentProps<'h3'>) => (
      <h3 className="mt-6 text-xl font-semibold tracking-tight" {...props} />
    ),
    p: (props: React.ComponentProps<'p'>) => (
      <p className="leading-7 text-foreground" {...props} />
    ),
    ul: (props: React.ComponentProps<'ul'>) => (
      <ul className="ml-6 list-disc leading-7" {...props} />
    ),
    ol: (props: React.ComponentProps<'ol'>) => (
      <ol className="ml-6 list-decimal leading-7" {...props} />
    ),
    table: (props: React.ComponentProps<'table'>) => (
      <ScrollArea className="w-full rounded-lg border">
        <Table {...props} />
      </ScrollArea>
    ),
    pre: (props: React.ComponentProps<'pre'>) => (
      <ScrollArea className="w-full rounded-lg bg-muted">
        <pre className="p-4 font-mono text-sm" {...props} />
      </ScrollArea>
    ),
    code: (props: React.ComponentProps<'code'>) => (
      <code className="rounded-sm bg-muted px-1 py-0.5 font-mono text-sm" {...props} />
    ),
    a: (props: React.ComponentProps<'a'>) => (
      <a className="text-primary underline-offset-4 hover:underline" {...props} />
    ),
    Callout,
    DataTable,
    DecisionTable,
    FormulaCard,
    MermaidDiagram,
    SourceReference,
    ...components,
  }
}
