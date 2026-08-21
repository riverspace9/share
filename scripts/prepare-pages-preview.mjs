import { cp, mkdir, rm } from 'node:fs/promises'
import { resolve } from 'node:path'

const outputDirectory = resolve('out')
const shareDirectory = resolve('.preview/share')

await rm(shareDirectory, { recursive: true, force: true })
await mkdir(shareDirectory, { recursive: true })
await cp(outputDirectory, shareDirectory, { recursive: true })
