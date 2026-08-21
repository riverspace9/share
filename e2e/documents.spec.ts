import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const browserErrors = new WeakMap<Page, string[]>()

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
  expect(browserErrors.get(page)).toEqual([])
})

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
