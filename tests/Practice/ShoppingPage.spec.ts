import { test as base, expect, type Page } from "@playwright/test";
import { PracticeLocators } from "../../Pages/locators";
import testDataJson from "../../TestData/SearchFilters.json";
import { loginCredentials } from "../../TestData/SearchFilters";
declare const process: any;
const test = base.extend<{ locators: PracticeLocators }>({
  locators: async ({ page }, use) => {
    const locators = new PracticeLocators(page);
    await use(locators);
  },
});

test.beforeEach(async ({ page }) => {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto("https://practicesoftwaretesting.com/", {
        waitUntil: "domcontentloaded",
        timeout: 60000,
      });
      await expect(page.locator('[data-test="nav-home"]')).toBeVisible({ timeout: 15000 });
      break;
    } catch (e) {
      if (attempt === 3) throw e;
    }
  }
});

test("Click first product", async ({ page, locators }) => {
  await page.waitForSelector("a.card");
  await expect(locators.productCard.first()).toBeVisible();
  await locators.productCard.first().click();
  await expect(page).toHaveURL(/\/product\//);
});

test("Interact with min slider and click first result", async ({ page, locators }) => {
  const firstHrefBefore = await locators.productCard.first().getAttribute("href");
  await page.waitForSelector("ngx-slider");
  const minHandle = locators.minSlider;
  const maxHandle = locators.maxSlider;
  await expect(minHandle).toBeVisible();
  await expect(maxHandle).toBeVisible();

  const minBox = await minHandle.boundingBox();
  if (minBox) {
    const startX = minBox.x + minBox.width / 2;
    const startY = minBox.y + minBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 90, startY, { steps: 10 });
    await page.mouse.up();
  }

  const maxBox = await maxHandle.boundingBox();
  if (maxBox) {
    const startX = maxBox.x + maxBox.width / 2;
    const startY = maxBox.y + maxBox.height / 2;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    await page.mouse.move(startX + 90, startY, { steps: 10 });
    await page.mouse.up();
  }

  await expect(async () => {
    const firstHrefAfter = await locators.productCard.first().getAttribute("href");
    expect(firstHrefAfter).not.toBe(firstHrefBefore);
  }).toPass();

  await locators.productCard.first().click();
  await expect(page).toHaveURL(/\/product\//);
});

test("Add search term and click first result", async ({ page, locators }) => {
  await locators.searchQueryInput.fill("Washers");
  await locators.searchSubmitButton.click();
  await expect(locators.searchResultCount).toContainText("1 product found for 'Washers'");
  await expect(locators.productName).toContainText("Washers");
  await locators.productCard.first().click();
});

test("Filter using checkbox and click 4th result", async ({ page, locators }) => {
  const firstHrefBefore = await locators.productCard.nth(3).getAttribute("href");
  await locators.filtersSection.getByText("Hammer").click();
  await locators.getFilterByText("Grinder").click();
  await expect(async () => {
    const firstHrefAfter = await locators.productCard.nth(3).getAttribute("href");
    expect(firstHrefAfter).not.toBe(firstHrefBefore);
  }).toPass();
  const productName = await locators.productName.nth(3).innerText();
  console.log(`Product : ${productName}`);
  await expect(locators.productCard.nth(3)).toBeVisible();
  await locators.productCard.nth(3).click();
});

test("Go to page and select product", async ({ page, locators }) => {
  const firstHrefBefore = await locators.productCard.nth(3).getAttribute("href");
  await page.getByRole("button", { name: "Page-3" }).click();
  await expect(async () => {
    const firstHrefAfter = await locators.productCard.nth(3).getAttribute("href");
    expect(firstHrefAfter).not.toBe(firstHrefBefore);
  }).toPass();
  const productName = await locators.productName.nth(3).innerText();
  console.log(`Product : ${productName}`);
  await expect(locators.productCard.nth(3)).toBeVisible();
  await locators.productCard.nth(3).click();
});

test("Sort and select product", async ({ page, locators }) => {
  // Capture BEFORE sorting so we have a baseline to compare against
  await page.waitForSelector("a.card");
  const firstHrefBefore = await locators.productCard.nth(3).getAttribute("href");
  console.log("Before sort href:", firstHrefBefore);

  await page.locator('[data-test="sort"]').selectOption("price,desc");

  // Now wait for the product list to update
  await expect(async () => {
    const firstHrefAfter = await locators.productCard.nth(3).getAttribute("href");
    console.log("After sort href:", firstHrefAfter);
    expect(firstHrefAfter).not.toBe(firstHrefBefore);
  }).toPass({ timeout: 15000 });

  const productName = await locators.productName.nth(6).innerText();
  console.log(`Product : ${productName}`);
  await expect(locators.productCard.nth(6)).toBeVisible({ timeout: 15000 });
  await locators.productCard.nth(6).click();
});
test("Filter category using dropdown and click first result", async ({ page, locators }) => {
  await locators.navCategories.click();
  await locators.navRentals.click();
  await expect(locators.pageTitle).toContainText("Rentals");
  await locators.getFilterByText("Heavy-duty tracked excavator").click();
  await expect(locators.productName).toBeVisible();
});

test("Click submit without filling contact form", async ({ page, locators }) => {
  await locators.navContact.click();
  await page.waitForURL('**/contact');
  await page.waitForLoadState('domcontentloaded');
  await locators.contactSubmitButton.click();
  await expect(locators.getErrorMessage("First name is required")).toBeVisible({ timeout: 15000 });
  await expect(locators.getErrorMessage("Last name is required")).toBeVisible({ timeout: 15000 });
  await expect(locators.getErrorMessage("Email is required")).toBeVisible({ timeout: 15000 });
  await expect(locators.subjectError).toContainText("Subject is required", { timeout: 15000 });
});

test("Contact Form - JSON", async ({ page, locators }) => {
  await locators.navContact.click();
  await page.waitForURL('**/contact');
  await page.waitForLoadState('domcontentloaded');
  await expect(locators.firstNameInput).toBeVisible({ timeout: 15000 });

  await locators.firstNameInput.fill(testDataJson.user1.firstName);
  await expect(locators.firstNameInput).toHaveValue(testDataJson.user1.firstName);

  await locators.lastNameInput.fill(testDataJson.user1.lastName);
  await expect(locators.lastNameInput).toHaveValue(testDataJson.user1.lastName);

  await locators.emailInput.fill(testDataJson.user1.email);
  await expect(locators.emailInput).toHaveValue(testDataJson.user1.email);

  await locators.subjectSelect.selectOption("payments");
  await locators.messageInput.fill(testDataJson.user1.message);
  await expect(locators.messageInput).toHaveValue(testDataJson.user1.message);

  await locators.fileInput.setInputFiles("tests/UploadFileTest.txt");
  await locators.contactSubmitButton.click();

  await expect(page.getByRole("alert")).toContainText(
    "Thanks for your message! We will contact you shortly.",
    { timeout: 15000 }
  );
});

test("Contact Form - TypeScript", async ({ page, locators }) => {
  await locators.navContact.click();
  await page.waitForURL('**/contact');
  await page.waitForLoadState('domcontentloaded');
  await expect(locators.firstNameInput).toBeVisible({ timeout: 15000 });

  await locators.firstNameInput.fill(loginCredentials.user1.firstName);
  await expect(locators.firstNameInput).toHaveValue(loginCredentials.user1.firstName);

  await locators.lastNameInput.fill(loginCredentials.user1.lastName);
  await expect(locators.lastNameInput).toHaveValue(loginCredentials.user1.lastName);

  await locators.emailInput.fill(loginCredentials.user1.email);
  await expect(locators.emailInput).toHaveValue(loginCredentials.user1.email);

  await locators.subjectSelect.selectOption("payments");
  await locators.messageInput.fill(loginCredentials.user1.message);
  await expect(locators.messageInput).toHaveValue(loginCredentials.user1.message);

  await locators.fileInput.setInputFiles("tests/UploadFileTest.txt");
  await locators.contactSubmitButton.click();

  await expect(page.getByRole("alert")).toContainText(
    "Thanks for your message! We will contact you shortly.",
    { timeout: 15000 }
  );
});

test("Compare products", async ({ page, locators }) => {
  await page.waitForSelector("a.card");
  const selectedItems = [];
  const positions = [1, 4, 7];

  for (const pos of positions) {
    await locators.compareButton.nth(pos).click();
    const itemName = await locators.cardTitle.nth(pos).innerText();
    selectedItems.push(itemName);
    console.log(`Selected item: ${itemName}`);
  }

  await locators.compareLink.click();

  const allProducts = locators.productName;
  await allProducts.first().waitFor({ state: "visible" });
  const count = await allProducts.count();
  console.log(`Item(s) selected: ${count}`);

  for (let i = 0; i < count; i++) {
    const productName = await allProducts.nth(i).innerText();
    console.log(`Product ${i + 1}: ${productName}`);
    await expect(allProducts.nth(i)).toContainText(selectedItems[i]);
  }

  await locators.clearComparisonButton.click();
  await expect(locators.getErrorMessage("No products selected for")).toBeVisible();
});

test("Registration - JSON", async ({ page, locators }) => {
  test.skip(!!process.env.CI, 'Skipping on CI - security verification required');
  test.setTimeout(200000);
  console.log("Able to hit page");
  await locators.navSignIn.click();
  await page.waitForURL('**/auth/login');
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible({ timeout: 15000 });

  await locators.registerLink.click();
  await page.waitForURL('**/auth/register');
  await expect(
    page.getByRole("heading", { name: "Customer registration" }),
  ).toBeVisible({ timeout: 15000 });
  console.log("Registration page loaded");

  await page.locator('[data-test="first-name"]').fill(testDataJson.user1.firstName);
  await expect(page.locator('[data-test="first-name"]')).toHaveValue(testDataJson.user1.firstName);

  await page.locator('[data-test="last-name"]').fill(testDataJson.user1.lastName);
  await expect(page.locator('[data-test="last-name"]')).toHaveValue(testDataJson.user1.lastName);

  await page.locator('[data-test="dob"]').fill(testDataJson.user1.dob);
  await expect(page.locator('[data-test="dob"]')).toHaveValue(testDataJson.user1.dob);

  await page.locator('[data-test="postal_code"]').fill(testDataJson.user1.postalCode);
  await expect(page.locator('[data-test="postal_code"]')).toHaveValue(testDataJson.user1.postalCode);

  await page.locator('[data-test="house_number"]').fill(testDataJson.user1.houseNo);
  await expect(page.locator('[data-test="house_number"]')).toHaveValue(testDataJson.user1.houseNo);

  await page.locator('[data-test="phone"]').fill(testDataJson.user1.phone);
  await expect(page.locator('[data-test="phone"]')).toHaveValue(testDataJson.user1.phone);

  await page.locator('[data-test="country"]').selectOption(testDataJson.user1.country);
  await expect(page.locator('[data-test="country"]')).not.toHaveValue('');

  const uniqueEmail = `johndoe${Math.random().toString(36).substring(2, 8)}@test.com`;
  await page.locator('[data-test="email"]').fill(uniqueEmail);
  await expect(page.locator('[data-test="email"]')).toHaveValue(uniqueEmail);

  await page.locator('[data-test="password"]').pressSequentially(testDataJson.user1.password, { delay: 100 });
  await expect(page.locator('[data-test="password"]')).toHaveValue(testDataJson.user1.password);
  await expect(page.locator('[data-test="register-submit"]')).toBeEnabled({ timeout: 15000 });
  await page.waitForLoadState('networkidle');
  console.log("Form filled in");

  await page.locator('[data-test="register-submit"]').click();
  await page.waitForURL('**/auth/login', { timeout: 30000 });
  console.log("Redirect to login");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle');
   // Add explicit wait for the login heading instead of just networkidle
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible({ timeout: 20000 });
  console.log("Current URL:", page.url());
  const headingJson = await page.locator('h1, h2, h3').first().innerText().catch(() => 'no heading found');
  console.log("Page heading found:", headingJson);

  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible({ timeout: 15000 });
  await expect(page.locator('[data-test="email"]')).toBeVisible({ timeout: 15000 });

  await page.locator('[data-test="email"]').fill(uniqueEmail);
  await page.locator('[data-test="password"]').fill(testDataJson.user1.password);

  await page.locator('[data-test="login-submit"]').click();
  await page.waitForURL('**/account', { timeout: 30000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle');
  console.log("Account page");

  await expect(page.locator('[data-test="nav-menu"]')).toBeVisible({ timeout: 15000 });
  await page.locator('[data-test="nav-menu"]').click();
  await expect(page.locator('[data-test="nav-sign-out"]')).toBeVisible({ timeout: 15000 });
  await page.locator('[data-test="nav-sign-out"]').click();
  await expect(page.locator('[data-test="nav-sign-in"]')).toBeVisible({ timeout: 15000 });
});

test("Registration - TypeScript Data", async ({ page, locators }) => {
  test.skip(!!process.env.CI, 'Skipping on CI - security verification required');
  test.setTimeout(200000);
  console.log("Able to hit page");
  await locators.navSignIn.click();
  await page.waitForURL('**/auth/login');
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible({ timeout: 15000 });

  await locators.registerLink.click();
  await page.waitForURL('**/auth/register');
  await expect(
    page.getByRole("heading", { name: "Customer registration" }),
  ).toBeVisible({ timeout: 15000 });
  console.log("Registration page loaded");

  await page.locator('[data-test="first-name"]').fill(loginCredentials.user1.firstName);
  await expect(page.locator('[data-test="first-name"]')).toHaveValue(loginCredentials.user1.firstName);

  await page.locator('[data-test="last-name"]').fill(loginCredentials.user1.lastName);
  await expect(page.locator('[data-test="last-name"]')).toHaveValue(loginCredentials.user1.lastName);

  await page.locator('[data-test="dob"]').fill(loginCredentials.user1.dob);
  await expect(page.locator('[data-test="dob"]')).toHaveValue(loginCredentials.user1.dob);

  await page.locator('[data-test="postal_code"]').fill(loginCredentials.user1.postalCode);
  await expect(page.locator('[data-test="postal_code"]')).toHaveValue(loginCredentials.user1.postalCode);

  await page.locator('[data-test="house_number"]').fill(loginCredentials.user1.houseNo);
  await expect(page.locator('[data-test="house_number"]')).toHaveValue(loginCredentials.user1.houseNo);

  await page.locator('[data-test="phone"]').fill(loginCredentials.user1.phone);
  await expect(page.locator('[data-test="phone"]')).toHaveValue(loginCredentials.user1.phone);

  await page.locator('[data-test="country"]').selectOption(loginCredentials.user1.country);
  await expect(page.locator('[data-test="country"]')).not.toHaveValue('');

  const uniqueEmail = `johndoe${Math.random().toString(36).substring(2, 8)}@test.com`;
  await page.locator('[data-test="email"]').fill(uniqueEmail);
  await expect(page.locator('[data-test="email"]')).toHaveValue(uniqueEmail);

  await page.locator('[data-test="password"]').pressSequentially(loginCredentials.user1.password, { delay: 100 });
  await expect(page.locator('[data-test="password"]')).toHaveValue(loginCredentials.user1.password);
  await expect(page.locator('[data-test="register-submit"]')).toBeEnabled({ timeout: 15000 });
  await page.waitForLoadState('networkidle');
  console.log("Form filled - submit enabled");

  await page.locator('[data-test="register-submit"]').click();
  await page.waitForURL('**/auth/login', { timeout: 30000 });
  console.log("Redirected to login");

  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle');
  console.log("Current URL:", page.url());
  // Add explicit wait for the login heading instead of just networkidle
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible({ timeout: 20000 });
  const headingTs = await page.locator('h1, h2, h3').first().innerText().catch(() => 'no heading found');
  console.log("Page heading found:", headingTs);

  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible({ timeout: 15000 });
  await expect(page.locator('[data-test="email"]')).toBeVisible({ timeout: 15000 });

  await page.locator('[data-test="email"]').fill(uniqueEmail);
  await page.locator('[data-test="password"]').fill(loginCredentials.user1.password);

  await page.locator('[data-test="login-submit"]').click();
  await page.waitForURL('**/account', { timeout: 30000 });
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('load');
  await page.waitForLoadState('networkidle');
  console.log("Account page");

  await expect(page.locator('[data-test="nav-menu"]')).toBeVisible({ timeout: 15000 });
  await page.locator('[data-test="nav-menu"]').click();
  await expect(page.locator('[data-test="nav-sign-out"]')).toBeVisible({ timeout: 15000 });
  await page.locator('[data-test="nav-sign-out"]').click();
  await expect(page.locator('[data-test="nav-sign-in"]')).toBeVisible({ timeout: 15000 });
});

test("Delete item from cart", async ({ page, locators }) => {
  await page.waitForSelector("a.card");
  await expect(locators.productCard.first()).toBeVisible();
  await locators.productCard.first().click();
  await expect(page).toHaveURL(/\/product\//);

  await page.locator('[data-test="add-to-cart"]').click();
  await expect(page.locator('div').filter({ hasText: 'Product added to shopping' }).nth(2)).toBeVisible();
  
  await page.locator('[data-test="nav-cart"]').click();
  await expect(page).toHaveURL(/checkout/);;
  await page.locator('.btn.btn-danger').click();
  await expect(page.getByRole('alert', { name: 'Product deleted.' })).toBeVisible();
  await expect(page.locator('aw-wizard')).toContainText('The cart is empty. Nothing to display.');
});  
test("Purchase first product", async ({ page, locators }) => {
  await page.waitForSelector("a.card");
  await expect(locators.productCard.first()).toBeVisible();
  await locators.productCard.first().click();
  await expect(page).toHaveURL(/\/product\//);

  await page.locator('[data-test="add-to-cart"]').click();
  await expect(page.locator('div').filter({ hasText: 'Product added to shopping' }).nth(2)).toBeVisible();
  await page.locator('[data-test="nav-cart"]').click();
  await expect(page).toHaveURL(/checkout/);

  await page.locator('[data-test="proceed-1"]').click();
  await page.getByRole('tab', { name: 'Continue as Guest' }).click();
  await page.locator('[data-test="guest-email"]').click();
  await page.locator('[data-test="guest-email"]').fill('test@test.com');
  await page.locator('[data-test="guest-email"]').press('Tab');
  await page.locator('[data-test="guest-first-name"]').fill('John');
  await page.locator('[data-test="guest-first-name"]').press('Tab');
  await page.locator('[data-test="guest-last-name"]').fill('Doe');
  await page.locator('[data-test="guest-submit"]').click();
  await page.locator('[data-test="proceed-2-guest"]').click();
  await page.locator('[data-test="country"]').selectOption('SG');
  await page.locator('[data-test="postal_code"]').click();
  await page.locator('[data-test="postal_code"]').fill('12345');
  await page.locator('[data-test="house_number"]').click();
  await page.locator('[data-test="house_number"]').fill('123');
  
  
  await expect(page.locator('[data-test="street"]')).not.toBeEmpty();
  await page.locator('[data-test="proceed-3"]').click();
  await page.locator('[data-test="payment-method"]').selectOption('credit-card');
  
  function generateMockCreditCard(): string {
  const parts: string[] = [];
  
  for (let i = 0; i < 4; i++) {
    // Generates a 4-digit number between 1000 and 9999
    const block = Math.floor(1000 + Math.random() * 9000).toString();
    parts.push(block);
  }
  
  return parts.join('-');
}
  const testCard = generateMockCreditCard();
 // 2. Generate Month (01 to 12)
  const month = Math.floor(1 + Math.random() * 12).toString().padStart(2, '0');
  // 3. Generate 4-Digit Year (1 to 5 years in the future from 2026)
  const currentYearFull = 2026; 
  const yearNum = currentYearFull + Math.floor(1 + Math.random() * 5);
  const year = yearNum.toString();
  const expiryDate = `${month}/${year}`
  const cvvNum = Math.floor(100 + Math.random() * 900);
  const cvv = cvvNum.toString();


  await page.locator('[data-test="credit_card_number"]').fill(testCard);
  await page.locator('[data-test="expiration_date"]').fill(expiryDate);
  await page.locator('[data-test="cvv"]').fill(cvv);
  await page.locator('[data-test="card_holder_name"]').fill('John Doe');
  await page.locator('[data-test="finish"]').click();
  await expect(page.locator('app-payment')).toContainText('Payment was successful');
  await page.locator('[data-test="finish"]').click();
  await expect(page.getByText('Thanks for your order! Your')).toBeVisible();
});