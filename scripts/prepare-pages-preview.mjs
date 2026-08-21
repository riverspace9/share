import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve('out')
const notFoundFile = resolve(outputDirectory, '404.html')
const previewNotFoundFile = resolve('.preview/404.html')
const shareDirectory = resolve('.preview/share')

await rm(shareDirectory, { recursive: true, force: true })
await rm(previewNotFoundFile, { force: true })
await mkdir(shareDirectory, { recursive: true })
await cp(outputDirectory, shareDirectory, { recursive: true })
await cp(notFoundFile, previewNotFoundFile)
