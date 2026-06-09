import { test as base, expect, type Page } from "@playwright/test";
import { PracticeLocators } from "../../Pages/locators";
import testDataJson from "../../playwright-examples-main/TestData/SearchFilters.json";
import { loginCredentials } from "../../playwright-examples-main/TestData/SearchFilters";

const test = base.extend<{ locators: PracticeLocators }>({
  locators: async ({ page }, use) => {
    const locators = new PracticeLocators(page);
    await use(locators);
  },
});

test.beforeEach(async ({ page }) => {
  await page.goto("https://practicesoftwaretesting.com/");
  await expect(page.getByRole('link', { name: 'Practice Software Testing -' })).toBeVisible();
});

test("Click first product", async ({ page, locators }) => {
  // wait for product cards to load
  await page.waitForSelector("a.card");
  // choose the first currently visible card, not the first hidden or filtered-out element
  await expect(locators.productCard.first()).toBeVisible();

  // click the card and verify navigation to a product page
  await locators.productCard.first().click();
  await expect(page).toHaveURL(/\/product\//);
});

test("Interact with min slider and click first result", async ({
  page,
  locators,
}) => {
  const firstHrefBefore = await locators.productCard
    .first()
    .getAttribute("href");
  await page.waitForSelector("ngx-slider");
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
    const firstHrefAfter = await locators.productCard
      .first()
      .getAttribute("href");
    expect(firstHrefAfter).not.toBe(firstHrefBefore);
  }).toPass();
  await locators.productCard.first().click();
  await expect(page).toHaveURL(/\/product\//);
});
test("Add search term and click first result", async ({ page, locators }) => {
  await locators.searchQueryInput.fill("Washers");
  await locators.searchSubmitButton.click();

  await expect(locators.searchResultCount).toContainText(
    "1 product found for 'Washers'",
  );
  await expect(locators.productName).toContainText("Washers");
  await expect(locators.productName).toContainText("Washers");
  await locators.productCard.first().click();
});
test("Filter using checkbox and click 4th result", async ({
  page,
  locators,
}) => {
  const firstHrefBefore = await locators.productCard
    .nth(3)
    .getAttribute("href");
  await locators.filtersSection.getByText("Hammer").click();
  await locators.getFilterByText("Grinder").click();
  await expect(async () => {
    const firstHrefAfter = await locators.productCard
      .nth(3)
      .getAttribute("href");
    expect(firstHrefAfter).not.toBe(firstHrefBefore);
  }).toPass();
  const allProducts = locators.productName;
  const productName = await allProducts.nth(3).innerText();
  console.log(`Product : ${productName}`);
  await expect(locators.productCard.nth(3)).toBeVisible();
  await locators.productCard.nth(3).click();
});
test("Go to page and select product", async ({ page, locators }) => {
  const firstHrefBefore = await locators.productCard
    .nth(3)
    .getAttribute("href");
  await page.getByRole("button", { name: "Page-3" }).click();
  await expect(async () => {
    const firstHrefAfter = await locators.productCard
      .nth(3)
      .getAttribute("href");
    expect(firstHrefAfter).not.toBe(firstHrefBefore);
  }).toPass();
  const allProducts = locators.productName;
  const productName = await allProducts.nth(3).innerText();
  console.log(`Product : ${productName}`);
  await expect(locators.productCard.nth(3)).toBeVisible();
  await locators.productCard.nth(3).click();
});
test("Sort and select product", async ({ page, locators }) => {
  await page.locator('[data-test="sort"]').click();
  await page.locator('[data-test="sort"]').selectOption("price,desc");
  const firstHrefBefore = await locators.productCard
    .nth(3)
    .getAttribute("href");
  await expect(async () => {
    const firstHrefAfter = await locators.productCard
      .nth(3)
      .getAttribute("href");
    expect(firstHrefAfter).not.toBe(firstHrefBefore);
  }).toPass();
  const allProducts = locators.productName;
  const productName = await allProducts.nth(6).innerText();
  console.log(`Product : ${productName}`);
  await expect(locators.productCard.nth(6)).toBeVisible();
  await locators.productCard.nth(6).click();
});
test("Filter category using dropdown and click first result", async ({
  page,
  locators,
}) => {
  await locators.navCategories.click();
  await locators.navRentals.click();
  await expect(locators.pageTitle).toContainText("Rentals");
  await locators.getFilterByText("Heavy-duty tracked excavator").click();
  await expect(locators.productName).toBeVisible();
});
test("Click submit without filling contact form", async ({
  page,
  locators,
}) => {
  await locators.navContact.click();
  await locators.contactSubmitButton.click();
  await expect(
    locators.getErrorMessage("First name is required"),
  ).toBeVisible();
  await expect(locators.getErrorMessage("Last name is required")).toBeVisible();
  await expect(locators.getErrorMessage("Email is required")).toBeVisible();
  await expect(locators.subjectError).toContainText("Subject is required");
});
test("Contact Form - JSON", async ({ page, locators }) => {
  await locators.navContact.click();
  await locators.firstNameInput.fill(testDataJson.user1.firstName);
  await locators.lastNameInput.fill(testDataJson.user1.lastName);
  await locators.emailInput.fill(testDataJson.user1.email);
  await locators.subjectSelect.selectOption("payments");
  await locators.messageInput.fill(testDataJson.user1.message);
  await locators.fileInput.setInputFiles("tests/UploadFileTest.txt");
  await locators.contactSubmitButton.click();
  await expect(page.getByRole("alert")).toContainText(
    "Thanks for your message! We will contact you shortly.",
  );
});
test("Contact Form - TypeScript", async ({ page, locators }) => {
  await locators.navContact.click();
  await locators.firstNameInput.fill(loginCredentials.user1.firstName);
  await locators.lastNameInput.fill(loginCredentials.user1.lastName);
  await locators.emailInput.fill(loginCredentials.user1.email);
  await locators.subjectSelect.selectOption("payments");
  await locators.messageInput.fill(loginCredentials.user1.message);
  await locators.fileInput.setInputFiles("tests/UploadFileTest.txt");
  await locators.contactSubmitButton.click();
  await expect(page.getByRole("alert")).toContainText(
    "Thanks for your message! We will contact you shortly.",
  );
});
test("Compare products", async ({ page, locators }) => {
  // wait for product cards to load
  await page.waitForSelector("a.card");

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
  await allProducts.first().waitFor({ state: "visible" });
  const count = await allProducts.count();
  console.log(`Item(s) selected:${count}`);
  for (let i = 0; i < count; i++) {
    // Check if this product matches any of the selected items
    const productName = await allProducts.nth(i).innerText();
    console.log(`Product ${i + 1}: ${productName}`);
    await expect(allProducts.nth(i)).toContainText(selectedItems[i]);
  }
  await locators.clearComparisonButton.click();
  await expect(
    locators.getErrorMessage("No products selected for"),
  ).toBeVisible();
});
test("Registration - JSON", async ({ page, locators }) => {
  console.log("Able to hit page");
  await locators.navSignIn.click();
  // Wait for login page to load before clicking register
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await locators.registerLink.click();
  // Wait for registration form to load before filling fields
  await expect(
    page.getByRole("heading", { name: "Customer registration" }),
  ).toBeVisible();
  console.log("Registration page loaded");
  await page
    .locator('[data-test="first-name"]')
    .fill(testDataJson.user1.firstName);
  await page
    .locator('[data-test="last-name"]')
    .fill(testDataJson.user1.lastName);
  await page.locator('[data-test="dob"]').fill(testDataJson.user1.dob);
  await page
    .locator('[data-test="postal_code"]')
    .fill(testDataJson.user1.postalCode);
  await page
    .locator('[data-test="house_number"]')
    .fill(testDataJson.user1.houseNo);
  await page.locator('[data-test="phone"]').fill(testDataJson.user1.phone);
  await page
    .locator('[data-test="country"]')
    .selectOption(testDataJson.user1.country);

  const uniqueEmail = `johndoe${Math.random().toString(36).substring(2, 8)}@test.com`;
  await page.locator('[data-test="email"]').fill(uniqueEmail);
  await expect(page.locator('[data-test="register-submit"]')).toBeEnabled();
  await page
    .locator('[data-test="password"]')
    .pressSequentially(testDataJson.user1.password, { delay: 200 });
  console.log("Form filled in");
  await page.locator('[data-test="register-submit"]').click();
  await page.waitForURL("**/auth/login");
  console.log("Redirect to login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await page.locator('[data-test="email"]').fill(uniqueEmail);
  await page
    .locator('[data-test="password"]')
    .fill(testDataJson.user1.password);
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForURL("**/account");
  console.log("Account page");
  await page.locator('[data-test="nav-menu"]').click();
  await page.locator('[data-test="nav-sign-out"]').click();
});

test("Registration - TypeScript Data", async ({ page, locators }) => {
  console.log("Able to hit page");
  await locators.navSignIn.click();
  // Wait for login page to load before clicking register
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await locators.registerLink.click();
  // Wait for registration form to load before filling fields
  await expect(
    page.getByRole("heading", { name: "Customer registration" }),
  ).toBeVisible();
  console.log("Registration page loaded");
  await page
    .locator('[data-test="first-name"]')
    .fill(loginCredentials.user1.firstName);
  await page
    .locator('[data-test="last-name"]')
    .fill(loginCredentials.user1.lastName);
  await page.locator('[data-test="dob"]').fill(loginCredentials.user1.dob);
  await page
    .locator('[data-test="postal_code"]')
    .fill(loginCredentials.user1.postalCode);
  await page
    .locator('[data-test="house_number"]')
    .fill(loginCredentials.user1.houseNo);
  await page.locator('[data-test="phone"]').fill(loginCredentials.user1.phone);
  await page
    .locator('[data-test="country"]')
    .selectOption(loginCredentials.user1.country);

  const uniqueEmail = `johndoe${Math.random().toString(36).substring(2, 8)}@test.com`;
  await page.locator('[data-test="email"]').fill(uniqueEmail);

  await expect(page.locator('[data-test="register-submit"]')).toBeEnabled();
  await page
    .locator('[data-test="password"]')
    .pressSequentially(loginCredentials.user1.password, { delay: 200 });
  console.log("Form filled in");
  await page.locator('[data-test="register-submit"]').click();
  await page.waitForURL("**/auth/login");
  console.log("Redirect to login");
  await expect(page.getByRole("heading", { name: "Login" })).toBeVisible();
  await page.locator('[data-test="email"]').fill(uniqueEmail);
  await page
    .locator('[data-test="password"]')
    .fill(loginCredentials.user1.password);
  await page.locator('[data-test="login-submit"]').click();
  await page.waitForURL("**/account");
  console.log("Account page");
  await page.locator('[data-test="nav-menu"]').click();
  await page.locator('[data-test="nav-sign-out"]').click();
});
