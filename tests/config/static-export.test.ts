import nextConfig from '../../next.config'

describe('GitHub Pages 정적 설정', () => {
  it('문서 경로를 실제 index.html로 내보낸다', () => {
    expect(nextConfig).toMatchObject({
      output: 'export',
      trailingSlash: true,
      basePath: '/share',
      images: { unoptimized: true },
    })
  })
})
