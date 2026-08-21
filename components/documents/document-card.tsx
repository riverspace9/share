import * as React from 'react'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export interface DocumentCardProps {
  title: string
  summary: string
  href: string
  updatedAt: string
  tags: readonly string[]
}

export function DocumentCard({
  title,
  summary,
  href,
  updatedAt,
  tags,
}: DocumentCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <a className="hover:text-primary" href={href}>
            {title}
          </a>
        </CardTitle>
        <CardDescription>{summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter className="justify-between gap-2 text-muted-foreground">
        <span>최종 업데이트</span>
        <time dateTime={updatedAt}>{updatedAt}</time>
      </CardFooter>
    </Card>
  )
}
