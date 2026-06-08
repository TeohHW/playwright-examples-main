import { test as base, expect, type Page } from '@playwright/test';
import { PracticeLocators } from '../../Pages/locators';
import testDataJson from '../../playwright-examples-main/TestData/SearchFilters.json';
import { loginCredentials } from '../../playwright-examples-main/TestData/SearchFilters';

const test = base.extend<{ locators: PracticeLocators }>({
  locators: async ({ page }, use) => {
    const locators = new PracticeLocators(page);
    await use(locators);
  },
});

test.beforeEach(async ({ page }) => {
    await page.goto('https://practicesoftwaretesting.com/');
});

test('Click first product', async ({ page, locators }) => {
    // wait for product cards to load
    await page.waitForSelector('a.card');
    // choose the first currently visible card, not the first hidden or filtered-out element
    await expect(locators.productCard.first()).toBeVisible();

    // click the card and verify navigation to a product page
    await locators.productCard.first().click();
    await expect(page).toHaveURL(/\/product\//);
});

test('Interact with min slider and click first result', async ({ page, locators }) => {
    const firstHrefBefore = await locators.productCard.first().getAttribute('href');
    console.log('First product href before slider interaction:', firstHrefBefore);
    await page.waitForSelector('ngx-slider');
    const minHandle = locators.minSlider;
    const maxHandle = locators.maxSlider;
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
   const firstHrefAfter = await locators.productCard.first().getAttribute('href');
   expect(firstHrefAfter).not.toBe(firstHrefBefore);
   console.log('First product href after slider interaction:', firstHrefAfter);
}).toPass();
    await locators.productCard.first().click();
    await expect(page).toHaveURL(/\/product\//);
});
test('Add search term and click first result', async ({ page, locators }) => {
   await locators.searchQueryInput.fill('Washers');
   await locators.searchSubmitButton.click();
   
   await expect(locators.searchResultCount).toContainText('1 product found for \'Washers\'');await expect(locators.productName).toContainText('Washers');
   await expect(locators.productName).toContainText('Washers');
   await locators.productCard.first().click();
});
test('Filter using checkbox and click 4th result', async ({ page, locators }) => {
  const firstHrefBefore = await locators.productCard.nth(3).getAttribute('href');
  console.log('Product href before filtering:', firstHrefBefore);
  await locators.filtersSection.getByText('Hammer').click();
  await locators.getFilterByText('Grinder').click();
  await expect(async () => {
  const firstHrefAfter = await locators.productCard.nth(3).getAttribute('href');
   expect(firstHrefAfter).not.toBe(firstHrefBefore);
   console.log('Product href after filtering:', firstHrefAfter);
}).toPass();
  await expect(locators.productCard.nth(3)).toBeVisible();
  await locators.productCard.nth(3).click();
});
test ('Filter category using dropdown and click first result', async ({ page, locators }) => {
  await locators.navCategories.click();
  await locators.navRentals.click();
  await expect(locators.pageTitle).toContainText('Rentals');
  await locators.getFilterByText('Heavy-duty tracked excavator').click();
  await expect(locators.productName).toBeVisible();
});
test('Click submit without filling contact form', async ({page, locators}) => {
  await locators.navContact.click();
  await locators.contactSubmitButton.click();
  await expect(locators.getErrorMessage('First name is required')).toBeVisible();
  await expect(locators.getErrorMessage('Last name is required')).toBeVisible();
  await expect(locators.getErrorMessage('Email is required')).toBeVisible();
  await expect(locators.subjectError).toContainText('Subject is required');
});
test ('Fill in contact form using JSON data and submit', async ({ page, locators }) => {
  await locators.navContact.click();
  await locators.firstNameInput.fill(testDataJson.user1.firstName);
  await locators.lastNameInput.fill(testDataJson.user1.lastName);
  await locators.emailInput.fill(testDataJson.user1.email);
  await locators.subjectSelect.selectOption('payments');
  await locators.messageInput.fill(testDataJson.user1.message);
  await locators.fileInput.setInputFiles('tests/UploadFileTest.txt');
  await locators.contactSubmitButton.click();
});
test ('Fill in contact form using TypeScript data and submit', async ({ page, locators }) => {
  await locators.navContact.click();
  await locators.firstNameInput.fill(loginCredentials.user1.firstName);
  await locators.lastNameInput.fill(loginCredentials.user1.lastName);
  await locators.emailInput.fill(loginCredentials.user1.email);
  await locators.subjectSelect.selectOption('payments');
  await locators.messageInput.fill(loginCredentials.user1.message);
  await locators.fileInput.setInputFiles('tests/UploadFileTest.txt');
  await locators.contactSubmitButton.click();
});
test ('Compare products', async ({ page, locators }) => {
// wait for product cards to load
await page.waitForSelector('a.card');

// Store selected items in an array
const selectedItems = [];
const positions = [1, 4, 7];

for (const pos of positions) {
  await locators.compareButton.nth(pos).click();
  const itemName = await locators.cardTitle.nth(pos).innerText();
  selectedItems.push(itemName);
  console.log(`Selected item: ${itemName}`);
}

await locators.compareLink.click();

// Verify all selected items appear on compare page
const allProducts = locators.productName;
await allProducts.first().waitFor({ state: 'visible' });
const count = await allProducts.count();
console.log(`Item(s) selected:${count}`);
for (let i = 0; i < count; i++) {
  // Check if this product matches any of the selected items
  const productName = await allProducts.nth(i).innerText();
  console.log(`Product ${i+1}: ${productName}`);
  await expect(allProducts.nth(i)).toContainText(selectedItems[i]);
}
  await locators.clearComparisonButton.click();
  await expect(locators.getErrorMessage('No products selected for')).toBeVisible();
});
test ('Registration - JSON', async ({ page, locators }) => {
  await locators.navSignIn.click();
  await locators.registerLink.click();

  //Submit
  await locators.registerSubmitButton.click();
});
test ('Registration - TypeScript Data', async ({ page, locators }) => {
  await locators.navSignIn.click();
  await locators.registerLink.click();

  //Submit
  await locators.registerSubmitButton.click();
});