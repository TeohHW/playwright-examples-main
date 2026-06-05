import { test as base, expect, type Page } from '@playwright/test';
import { PracticeLocators } from '../../Pages/locators';

const test = base.extend<{ locators: PracticeLocators }>({
  locators: async ({ page }, use) => {
    const locators = new PracticeLocators(page);
    await use(locators);
  },
});

test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
});

test('Click first product', async ({ page }) => {
    // wait for product cards to load
    await page.waitForSelector('a.card');
    // choose the first currently visible card, not the first hidden or filtered-out element
    await expect(page.locator('a.card:visible').first()).toBeVisible();

    // click the card and verify navigation to a product page
    await page.locator('a.card:visible').first().click();
    await expect(page).toHaveURL(/\/product\//);
});

test('Interact with min slider and click first result', async ({ page }) => {
    const firstHrefBefore = await page.locator('a.card:visible').first().getAttribute('href');
    console.log('First product href before slider interaction:', firstHrefBefore);
    await page.waitForSelector('ngx-slider');
    const minHandle = page.locator('span[role=slider].ngx-slider-pointer-min');
    const maxHandle = page.locator('span[role=slider].ngx-slider-pointer-max');
    await expect(minHandle).toBeVisible();
    await expect(maxHandle).toBeVisible();

    // Move min slider 120px to the right
    const minBox = await minHandle.boundingBox();
    if (minBox) {
      const startX = minBox.x + minBox.width / 2;
      const startY = minBox.y + minBox.height / 2;
      const endX = startX + 90;
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, startY, { steps: 10 });
      await page.mouse.up();
    }

    // Move max slider 120px to the right
    const maxBox = await maxHandle.boundingBox();
    if (maxBox) {
      const startX = maxBox.x + maxBox.width / 2;
      const startY = maxBox.y + maxBox.height / 2;
      const endX = startX + 90;
      await page.mouse.move(startX, startY);
      await page.mouse.down();
      await page.mouse.move(endX, startY, { steps: 10 });
      await page.mouse.up();
    }
   await expect(async () => {
   const firstHrefAfter = await page.locator('a.card:visible').first().getAttribute('href');
   expect(firstHrefAfter).not.toBe(firstHrefBefore);
   console.log('First product href after slider interaction:', firstHrefAfter);
}).toPass();
    await page.locator('a.card:visible').first().click();
    await expect(page).toHaveURL(/\/product\//);
});
test('Add search term and click first result', async ({ page }) => {
   await page.locator('[data-test="search-query"]').fill('Washers');
   await page.locator('[data-test="search-submit"]').click();
   
   await expect(page.getByTestId('search-result-count')).toContainText('1 product found for \'Washers\'');await expect(page.locator('[data-test="product-name"]')).toContainText('Washers');
   await expect(page.locator('[data-test="product-name"]')).toContainText('Washers');
   await page.locator('a.card:visible').first().click();
});
