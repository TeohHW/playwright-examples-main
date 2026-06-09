import { test, expect } from "@playwright/test";
import { PracticeLocators } from "../../Pages/locators";

test.beforeEach(async ({ page }) => {
  await page.goto("https://rahulshettyacademy.com/AutomationPractice/");
  const locators = new PracticeLocators(page);
  await expect(locators.pageHeading).toBeVisible();
});

test.afterEach(async ({ page }) => {
  await page.waitForTimeout(2000);
  await page.close();
});

test("Radio button", async ({ page }) => {
  const locators = new PracticeLocators(page);
  await locators.radio1.click();
  await expect(locators.radio1).toBeChecked();
  await expect(locators.radio2).not.toBeChecked();
  await expect(locators.radio3).not.toBeChecked();

  await locators.radio2.click();
  await expect(locators.radio2).toBeChecked();
  await expect(locators.radio1).not.toBeChecked();
  await expect(locators.radio3).not.toBeChecked();

  await locators.radio3.click();
  await expect(locators.radio3).toBeChecked();
  await expect(locators.radio1).not.toBeChecked();
  await expect(locators.radio2).not.toBeChecked();
});

test("Suggestion box", async ({ page }) => {
  const locators = new PracticeLocators(page);
  await locators.suggestionBox.fill("Singapore");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(locators.suggestionBox).toHaveValue("Singapore");
});

test("Dropdown", async ({ page }) => {
  const locators = new PracticeLocators(page);
  await locators.dropdown.click();
  await locators.dropdown.selectOption("option1");
  await locators.dropdown.selectOption("option3");
  await locators.dropdown.selectOption("option2");
  await expect(locators.dropdown).toHaveValue("option2");
});

test("Checkboxes", async ({ page }) => {
  const locators = new PracticeLocators(page);
  await locators.checkboxOption1.click();
  await locators.checkboxOption2.click();
  await locators.checkboxOption3.click();
  await expect(locators.checkboxElementOption1).toBeChecked();
  await expect(locators.checkboxElementOption2).toBeChecked();
  await expect(locators.checkboxElementOption3).toBeChecked();
});
test("Switch to new tab", async ({ page }) => {
  const locators = new PracticeLocators(page);
  const newTabPromise = page.waitForEvent("popup");
  await locators.openTabLink.click();
  const newTab = await newTabPromise;

  await newTab.waitForLoadState('domcontentloaded');
  console.log("New tab URL:", newTab.url());

  // Check URL instead of page content since site may redirect on CI
  await expect(newTab).toHaveURL(/qaclickacademy\.com/, { timeout: 15000 });
  await newTab.close();
});

test("Switch to new window", async ({ page }) => {
  const locators = new PracticeLocators(page);
  const newWindowPromise = page.waitForEvent("popup");
  await locators.openWindowButton.click();
  const newWindow = await newWindowPromise;

  await newWindow.waitForLoadState('domcontentloaded');
  console.log("New window URL:", newWindow.url());

  // Check URL instead of page content
  await expect(newWindow).toHaveURL(/qaclickacademy\.com/, { timeout: 15000 });
  await newWindow.close();
});

test("Hide and Show", async ({ page }) => {
  const locators = new PracticeLocators(page);
  await locators.hideButton.click();
  await expect(locators.hideShowTextbox).not.toBeVisible();
  await locators.showButton.click();
  await expect(locators.hideShowTextbox).toBeVisible();
});

test("Alert and Confirm", async ({ page }) => {
  const locators = new PracticeLocators(page);
  const nameToFill = "John Doe";
  // register BEFORE the click that triggers it
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("alert");
    expect(dialog.message()).toBe(
      "Hello , share this practice page and share your knowledge",
    );
    await dialog.accept();
  });
  await locators.alertButton.click();
  // register BEFORE the click that triggers it
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toContain(nameToFill);
    await dialog.accept();
  });
  await locators.nameTextbox.fill(nameToFill);
  await locators.confirmButton.click();
});

test("Web Table", async ({ page }) => {
  const locators = new PracticeLocators(page);
  const webTable = locators.webTable;
  const firstRow = webTable.locator("tr").nth(3);
  await expect(firstRow.locator("td").nth(0)).toHaveText("Dwayne");
  await expect(firstRow.locator("td").nth(1)).toHaveText("Manager");
  await expect(firstRow.locator("td").nth(2)).toHaveText("Kolkata");
  await expect(firstRow.locator("td").nth(3)).toHaveText("48");
  console.log(await firstRow.locator("td").nth(0).innerText());
  console.log(await firstRow.locator("td").nth(1).innerText());
  console.log(await firstRow.locator("td").nth(2).innerText());
  console.log(await firstRow.locator("td").nth(3).innerText());

  const chennaiRows = webTable.locator("tbody tr").filter({
    has: page.locator("td").nth(2).getByText("Chennai", { exact: true }),
  });

  const chennaiCount = await chennaiRows.count();
  console.log("-----------------------------------");
  console.log(`People from Chennai: ${chennaiCount}`);
  expect(chennaiCount).toBeGreaterThan(0);

  const total = await webTable.locator("tbody tr").evaluateAll((rows) =>
    rows.reduce((sum, row) => {
      const fourthCell = row.querySelectorAll("td")[3];
      return sum + parseFloat(fourthCell?.innerText || "0");
    }, 0),
  );
  const amountText = await locators.getTotalAmountText().innerText();
  const amount = amountText.replace("Total Amount Collected:", "").trim();
  expect(amount).toBe(total.toString());
  console.log(`Displayed: ${amount} | Calculated: ${total}`);
});

test("Mouse Hover", async ({ page }) => {
  const locators = new PracticeLocators(page);
  await locators.mouseHoverButton.hover();
  await expect(locators.topLink).toBeVisible();
  await expect(locators.reloadLink).toBeVisible();
  await locators.reloadLink.click();
  await expect(page).toHaveURL(
    "https://rahulshettyacademy.com/AutomationPractice/",
  );
  await locators.mouseHoverButton.hover();
  await locators.topLink.click();
  await expect(page).toHaveURL(
    "https://rahulshettyacademy.com/AutomationPractice/#top",
  );
});

test("iFrame", async ({ page }) => {
  const locators = new PracticeLocators(page);
  await expect(locators.iframeGroup).toBeVisible();
  await locators.iframeCoursesLink?.click();
  await locators.mouseHoverButton.click();
  await expect(locators.iframeMain).toContainText("Browse products");
});