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

async function inventoryCell(
  table: Locator,
  rowIdentifier: string,
  columnName: string
): Promise<Locator> {
  const columnIndex = await table.getByRole('columnheader').evaluateAll((headers, name) => (
    headers.findIndex((header) => header.textContent?.trim() === name)
  ), columnName)
  expect(columnIndex).toBeGreaterThanOrEqual(0)

  const row = table.locator('tbody tr').filter({
    hasText: rowIdentifier,
  })
  await expect(row).toHaveCount(1)

  return row.locator('td').nth(columnIndex)
}

async function visualStyles(locator: Locator) {
  return locator.evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      backgroundColor: style.backgroundColor,
      borderColor: style.borderTopColor,
      color: style.color,
      fontSize: style.fontSize,
      fontWeight: style.fontWeight,
      height: element.getBoundingClientRect().height,
      paddingLeft: style.paddingLeft,
      paddingRight: style.paddingRight,
      textDecorationLine: style.textDecorationLine,
    }
  })
}

async function primaryBadgeStyles(page: Page) {
  return page.evaluate(() => {
    const probe = document.createElement('span')
    probe.style.color = 'var(--primary)'
    probe.style.borderColor = 'color-mix(in oklab, var(--primary) 50%, transparent)'
    probe.style.backgroundColor = 'color-mix(in oklab, var(--primary) 10%, transparent)'
    document.body.append(probe)

    const style = getComputedStyle(probe)
    const result = {
      backgroundColor: style.backgroundColor,
      borderColor: style.borderTopColor,
      color: style.color,
    }
    probe.remove()

    return result
  })
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
  await expect(page.getByRole('group', { name: '플라워 테이블' })).toContainText('FevFlowerOrder*')
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

test('변경 셀은 강조 배지로 표시하고 반복 값은 값 찾기 상태에서만 반응한다', async ({ page }, testInfo) => {
  await page.goto('/share/documents/inventory-flow/')
  await page.getByRole('tab', { name: /탁송/ }).click()
  await page.getByRole('button', { name: '3단계 상차 품목 확인' }).click()

  const inventoryUnitsTable = page.locator('#inventory-table-InventoryUnits')
  const changedStatusCell = await inventoryCell(inventoryUnitsTable, 'BC-1001', 'status')
  const regularBarcodeCell = await inventoryCell(inventoryUnitsTable, 'BC-1001', 'barcode')
  const [changedStyles, regularStyles] = await Promise.all([
    visualStyles(changedStatusCell),
    visualStyles(regularBarcodeCell),
  ])
  const expectedPrimaryStyles = await primaryBadgeStyles(page)

  expect(changedStyles.backgroundColor).toBe(regularStyles.backgroundColor)
  expect(changedStyles.color).toBe(regularStyles.color)

  const changedBadge = changedStatusCell.getByText('변경', { exact: true })
  await expect(changedBadge).toBeVisible()
  const badgeStyles = await visualStyles(changedBadge)
  expect(badgeStyles.backgroundColor).toBe(expectedPrimaryStyles.backgroundColor)
  expect(badgeStyles.borderColor).toBe(expectedPrimaryStyles.borderColor)
  expect(badgeStyles.color).toBe(expectedPrimaryStyles.color)
  expect(badgeStyles.fontSize).toBe('11px')
  expect(badgeStyles.fontWeight).toBe('600')
  expect(badgeStyles.height).toBe(20)
  expect(badgeStyles.paddingLeft).toBe('6px')
  expect(badgeStyles.paddingRight).toBe('6px')
  await expect(regularBarcodeCell.getByText('변경', { exact: true })).toHaveCount(0)

  const transferUnitLinksTable = page.locator('#inventory-table-InvTransferItemUnits')
  const insertedUnitLinkIdCell = await inventoryCell(transferUnitLinksTable, 'TU-1', 'id')
  const insertedUnitLinkRow = insertedUnitLinkIdCell.locator('xpath=ancestor::tr')
  await expect(insertedUnitLinkRow).toHaveCount(1)
  await expect(insertedUnitLinkRow.getByText('변경', { exact: true })).toHaveCount(0)

  const changedValueButton = changedStatusCell.getByRole('button', { name: 'RESERVED', exact: true })
  await expect(changedValueButton).toHaveAttribute('aria-pressed', 'false')
  expect(await visualStyles(changedValueButton)).toMatchObject({
    backgroundColor: changedStyles.backgroundColor,
    color: changedStyles.color,
  })
  await changedBadge.click()
  await expect(changedValueButton).toHaveAttribute('aria-pressed', 'false')

  const transferItemsTable = page.locator('#inventory-table-InvTransferItems')
  const identifierCell = await inventoryCell(transferItemsTable, 'TI-1', 'transfer_item_id')
  const identifier = identifierCell.getByRole('button', { name: 'TI-1', exact: true })
  const defaultStyles = await visualStyles(identifier)

  expect(defaultStyles.textDecorationLine).toBe('none')

  await identifier.click()
  await expect(identifier).toHaveAttribute('aria-pressed', 'true')
  await page.mouse.move(0, 0)
  expect(await visualStyles(identifier)).toMatchObject({
    backgroundColor: defaultStyles.backgroundColor,
    color: defaultStyles.color,
  })

  if (testInfo.project.name === 'mobile') {
    await expectNoPageOverflow(page)
  } else {
    await identifier.hover()
    expect((await visualStyles(identifier)).backgroundColor).not.toBe(defaultStyles.backgroundColor)

    await page.mouse.move(0, 0)
    await page.getByRole('tab', { name: /탁송/ }).focus()
    for (let focusMove = 0; focusMove < 200; focusMove += 1) {
      await page.keyboard.press('Tab')
      if (await identifier.evaluate((element) => document.activeElement === element)) break
    }
    await expect(identifier).toBeFocused()
    expect((await visualStyles(identifier)).backgroundColor).not.toBe(defaultStyles.backgroundColor)
  }
})

test('흐름 탭을 외곽선과 선택 배경이 있는 버튼으로 표시한다', async ({ page }) => {
  await page.goto('/share/documents/inventory-flow/')

  const activeTab = page.getByRole('tab', { name: '일반 배송 흐름' })
  const inactiveTab = page.getByRole('tab', { name: '물류센터 입고' })
  await expect(activeTab).toBeVisible()
  await expect(inactiveTab).toBeVisible()

  const tabHeights = await page.getByRole('tab').evaluateAll((tabs) => (
    tabs.map((tab) => tab.getBoundingClientRect().height)
  ))

  const [activeStyle, inactiveStyle] = await Promise.all([
    activeTab.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderTopColor,
        borderRadius: style.borderRadius,
        cursor: style.cursor,
        height: element.getBoundingClientRect().height,
      }
    }),
    inactiveTab.evaluate((element) => {
      const style = getComputedStyle(element)
      return {
        backgroundColor: style.backgroundColor,
        borderColor: style.borderTopColor,
      }
    }),
  ])

  expect(activeStyle.height).toBeGreaterThanOrEqual(44)
  expect(new Set(tabHeights).size).toBe(1)
  expect(tabHeights[0]).toBe(64)
  expect(activeStyle.cursor).toBe('pointer')
  expect(activeStyle.borderRadius).not.toBe('0px')
  expect(activeStyle.borderColor).not.toBe('rgba(0, 0, 0, 0)')
  expect(inactiveStyle.borderColor).not.toBe('rgba(0, 0, 0, 0)')
  expect(activeStyle.backgroundColor).not.toBe(inactiveStyle.backgroundColor)
})

test('단계 버튼의 크기와 텍스트 위치를 미구현 태그와 무관하게 유지한다', async ({ page }) => {
  await page.goto('/share/documents/inventory-flow/')
  await page.getByRole('tab', { name: /탁송/ }).click()

  const stepMetrics = await page.locator('button[aria-label^="1단계"], button[aria-label^="2단계"], button[aria-label^="3단계"], button[aria-label^="4단계"], button[aria-label^="5단계"], button[aria-label^="6단계"], button[aria-label^="7단계"]').evaluateAll((buttons) => (
    buttons.map((button) => {
      const rect = button.getBoundingClientRect()
      return {
        height: rect.height,
        childCount: button.children.length,
        titleTop: button.children[1]?.getBoundingClientRect().top - rect.top,
        tagTop: button.children[2]?.getBoundingClientRect().top - rect.top,
      }
    })
  ))

  expect(stepMetrics).toHaveLength(7)
  expect(new Set(stepMetrics.map((metric) => metric.height))).toEqual(new Set([96]))
  expect(new Set(stepMetrics.map((metric) => metric.childCount))).toEqual(new Set([3]))
  expect(new Set(stepMetrics.map((metric) => metric.titleTop)).size).toBe(1)
  expect(new Set(stepMetrics.map((metric) => metric.tagTop)).size).toBe(1)
})

test('전체 흐름표의 선택 행을 둥근 외곽선 안에서 잘라 표시한다', async ({ page }) => {
  await page.goto('/share/documents/inventory-flow/')
  await page.getByRole('tab', { name: '근조기ㆍ축기 (수량 재고)' }).click()
  await page.getByRole('button', { name: '5단계 실사 수량 입력과 완료' }).click()

  const caption = page.getByText('전체 흐름. 줄을 누르면 그 단계로 이동한다', { exact: true })
  const overview = caption.locator('..')
  const selectedRow = overview.locator('tr[data-state="selected"]')
  await expect(selectedRow).toBeVisible()

  const metrics = await overview.evaluate((element) => {
    const style = getComputedStyle(element)
    const captionElement = element.firstElementChild
    const selected = element.querySelector('tr[data-state="selected"]')
    const firstCell = element.querySelector('tbody td')
    const outerRect = element.getBoundingClientRect()
    const selectedRect = selected?.getBoundingClientRect()
    return {
      overflow: style.overflow,
      paddingLeft: style.paddingLeft,
      paddingTop: style.paddingTop,
      captionBorderBottom: captionElement ? getComputedStyle(captionElement).borderBottomWidth : '',
      cellFontSize: firstCell ? getComputedStyle(firstCell).fontSize : '',
      selectedLeftInset: selectedRect ? selectedRect.left - outerRect.left : 0,
      selectedBottomInset: selectedRect ? outerRect.bottom - selectedRect.bottom : 0,
    }
  })

  expect(metrics.overflow).toBe('hidden')
  expect(metrics.paddingLeft).toBe('0px')
  expect(metrics.paddingTop).toBe('0px')
  expect(metrics.captionBorderBottom).toBe('1px')
  expect(metrics.cellFontSize).toBe('14px')
  expect(metrics.selectedLeftInset).toBeGreaterThanOrEqual(1)
  expect(metrics.selectedBottomInset).toBeGreaterThanOrEqual(1)
})

test('데스크톱에서 재고 테이블 관계도가 첫 화면 너비 안에 표시된다', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', '데스크톱 viewport 전용 검사')

  await page.goto('/share/documents/inventory-flow/')

  const diagram = page.getByRole('img', { name: '재고 입출고 테이블 관계' })
  const viewport = diagram.locator('xpath=ancestor::*[@data-slot="scroll-area-viewport"]')
  await expect(diagram.locator('svg')).toBeVisible()
  await expect
    .poll(async () => {
      const [diagramWidth, viewportWidth] = await Promise.all([
        diagram.locator('svg').evaluate((svg) => svg.clientWidth),
        viewport.evaluate((element) => element.clientWidth),
      ])

      return diagramWidth <= viewportWidth
    })
    .toBe(true)
})

test('데스크톱에서 테이블 구분을 3개 그룹으로 넓게 표시한다', async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== 'desktop', '데스크톱 viewport 전용 검사')

  await page.goto('/share/documents/inventory-flow/')

  const relationshipOverview = page.getByRole('region', { name: '테이블 구분과 관계' })
  await expect(relationshipOverview).toBeVisible()
  await expect(relationshipOverview.getByRole('heading', { name: '0. 테이블 관계' })).toBeVisible()
  const flowerGroup = page.getByRole('group', { name: '플라워 테이블' })
  await expect(flowerGroup).toBeVisible()
  await expect(page.getByRole('group', { name: '재고 이관 테이블' })).toBeVisible()
  await expect(page.getByRole('group', { name: '재고 테이블' })).toContainText('InventoryAuditItems')
  await expect
    .poll(() => relationshipOverview.evaluate((element) => element.getBoundingClientRect().width))
    .toBeGreaterThan(1200)
  await expect
    .poll(() => flowerGroup.evaluate((element) => element.getBoundingClientRect().height))
    .toBeGreaterThanOrEqual(230)
  await expect.poll(() => flowerGroup.evaluate((element) => getComputedStyle(element).borderTopWidth)).toBe('1px')
})

test('Mermaid 노드를 플라워, 재고 이관, 재고 3가지 색으로 구분한다', async ({ page }) => {
  await page.goto('/share/documents/inventory-flow/')

  const nodes = page
    .getByRole('img', { name: '재고 입출고 테이블 관계' })
    .locator('g.node')
  await expect(nodes.first()).toBeVisible()

  const nodeColors = await nodes.evaluateAll((elements) => (
    elements.map((node) => {
      const rect = node.querySelector('rect')
      return rect ? `${getComputedStyle(rect).fill}|${getComputedStyle(rect).stroke}` : ''
    })
  ))
  expect(new Set(nodeColors).size).toBe(3)
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
