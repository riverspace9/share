import createMDX from '@next/mdx'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath: '/share',
  images: { unoptimized: true },
  pageExtensions: ['ts', 'tsx', 'md', 'mdx'],
}

export default createMDX()(nextConfig)
