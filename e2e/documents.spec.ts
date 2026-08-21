import { expect, test } from '@playwright/test'
import type { Locator, Page } from '@playwright/test'

const browserErrors = new WeakMap<Page, string[]>()
const expectedNotFoundPages = new WeakSet<Page>()
const navigation404Error =
  'console: Failed to load resource: the server responded with a status of 404 (Not Found)'

test.beforeEach(async ({ page }) => {
  const errors: string[] = []
  browserErrors.set(page, errors)

  page.on('console', (message) => {
    if (message.type() === 'error') {
      errors.push(`console: ${message.text()}`)
    }
  })
  page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
})

test.afterEach(async ({ page }) => {
  const errors = browserErrors.get(page) ?? []
  const unexpectedErrors = expectedNotFoundPages.has(page)
    ? errors.filter((error) => error !== navigation404Error)
    : errors

  expect(unexpectedErrors).toEqual([])
})

async function expectHorizontalScroll(viewport: Locator) {
  await expect
    .poll(() => viewport.evaluate((element) => element.scrollWidth > element.clientWidth))
    .toBe(true)

  await viewport.evaluate((element) => {
    element.scrollLeft = Math.min(120, element.scrollWidth - element.clientWidth)
  })
  await expect.poll(() => viewport.evaluate((element) => element.scrollLeft)).toBeGreaterThan(0)
}

async function expectNoPageOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))

  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth)
}

test('문서 목록과 직접 경로가 새로고침 후에도 열린다', async ({ page }) => {
  await page.goto('/share/')
  await expect(page.getByRole('link')).toHaveCount(2)

  await page.goto('/share/documents/flower-hq-consignment-fees/')
  await page.reload()

  await expect(page.getByRole('heading', { name: '본부 탁송 비용 계산' })).toBeVisible()
})

test('재고 문서 직접 경로를 새로고침한 뒤 흐름과 단계, 정렬, Mermaid를 조작할 수 있다', async ({ page }) => {
  await page.goto('/share/documents/inventory-flow/')
  await page.reload()

  await expect(page.getByRole('heading', { name: '재고 입출고 흐름' })).toBeVisible()
  await expect(page.getByRole('tab')).toHaveCount(5)
  await expect(
    page.getByRole('img', { name: '재고 입출고 테이블 관계' }).locator('svg')
  ).toBeVisible()

  await page.getByRole('tab', { name: /탁송/ }).click()
  await page.getByRole('button', { name: '3단계 상차 품목 확인' }).click()
  await expect(page.getByRole('heading', { name: '상차 품목 확인' })).toBeVisible()

  const reorderCheckbox = page.getByRole('checkbox', { name: '바뀐 테이블을 맨 위로 모으기' })
  await reorderCheckbox.check()
  await expect(reorderCheckbox).toBeChecked()
  await expect(page.getByTestId('schema-table').first()).toContainText('변경')
})

test('존재하지 않는 문서 경로는 실제 404 응답과 복귀 링크를 제공한다', async ({ page }) => {
  expectedNotFoundPages.add(page)
  const response = await page.goto('/share/documents/not-found/')

  expect(response?.status()).toBe(404)
  await expect(page.getByRole('heading', { name: '문서를 찾을 수 없습니다' })).toBeVisible()
  await expect(page.getByRole('link', { name: '문서 목록' })).toHaveAttribute('href', '/share/')
})

test(
  '모바일에서 Mermaid와 코드 블록만 가로로 이동하고 페이지는 넘치지 않는다',
  async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== 'mobile', '모바일 viewport 전용 검사')

    await page.goto('/share/documents/inventory-flow/')
    const mermaidViewport = page
      .getByRole('img', { name: '재고 입출고 테이블 관계' })
      .locator('xpath=ancestor::*[@data-slot="scroll-area-viewport"]')
    await expect(
      page.getByRole('img', { name: '재고 입출고 테이블 관계' }).locator('svg')
    ).toBeVisible()
    await expectHorizontalScroll(mermaidViewport)
    await expectNoPageOverflow(page)

    await page.goto('/share/documents/flower-hq-consignment-fees/')
    const codeViewport = page
      .locator('pre', { hasText: '화환 수량 = 0' })
      .locator('xpath=ancestor::*[@data-slot="scroll-area-viewport"]')
    await expectHorizontalScroll(codeViewport)
    await expectNoPageOverflow(page)
  }
)
