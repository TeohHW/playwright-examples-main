import { Page } from '@playwright/test';

export class PracticeLocators {
  constructor(private page: Page) {}
  //Rahulshettyacademy Practice Page Locators
  // Header
  get pageHeading() {
    return this.page.getByRole('heading', { name: 'Practice Page' });
  }

  // Radio Buttons
  get radio1() {
    return this.page.locator('label').filter({ hasText: 'Radio1' }).getByRole('radio');
  }

  get radio2() {
    return this.page.locator('label').filter({ hasText: 'Radio2' }).getByRole('radio');
  }

  get radio3() {
    return this.page.locator('label').filter({ hasText: 'Radio3' }).getByRole('radio');
  }

  // Suggestion Box
  get suggestionBox() {
    return this.page.getByRole('textbox', { name: 'Type to Select Countries' });
  }

  // Dropdown
  get dropdown() {
    return this.page.locator('#dropdown-class-example');
  }

  // Checkboxes
  get checkboxOption1() {
    return this.page.locator('#checkBoxOption1');
  }

  get checkboxOption2() {
    return this.page.locator('#checkBoxOption2');
  }

  get checkboxOption3() {
    return this.page.locator('#checkBoxOption3');
  }

  // Checkbox assertions
  get checkboxElementOption1() {
    return this.page.locator('#checkbox-example').getByText('Option1').getByRole('checkbox');
  }

  get checkboxElementOption2() {
    return this.page.locator('#checkbox-example').getByText('Option2').getByRole('checkbox');
  }

  get checkboxElementOption3() {
    return this.page.locator('#checkbox-example').getByText('Option3').getByRole('checkbox');
  }

  // Window/Tab Buttons
  get openWindowButton() {
    return this.page.getByRole('button', { name: 'Open Window' });
  }

  get openTabLink() {
    return this.page.getByRole('link', { name: 'Open Tab' });
  }

  // Hide/Show Elements
  get hideButton() {
    return this.page.getByRole('button', { name: 'Hide' });
  }

  get showButton() {
    return this.page.getByRole('button', { name: 'Show' });
  }

  get hideShowTextbox() {
    return this.page.getByRole('textbox', { name: 'Hide/Show Example' });
  }

  // Alert/Confirm Buttons
  get alertButton() {
    return this.page.getByRole('button', { name: 'Alert' });
  }

  get nameTextbox() {
    return this.page.getByRole('textbox', { name: 'Enter Your Name' });
  }

  get confirmButton() {
    return this.page.getByRole('button', { name: 'Confirm' });
  }

  // Web Table
  get webTable() {
    return this.page.getByRole('group', { name: 'Web Table Fixed header' });
  }

  // Mouse Hover
  get mouseHoverButton() {
    return this.page.getByRole('button', { name: 'Mouse Hover' });
  }

  get topLink() {
    return this.page.getByRole('link', { name: 'Top' });
  }

  get reloadLink() {
    return this.page.getByRole('link', { name: 'Reload' });
  }

  // iFrame
  get iframeGroup() {
    return this.page.getByRole('group', { name: 'iFrame Example' });
  }

  get iframe() {
    return this.page.locator('iframe[name="iframe-name"]');
  }

  get iframeMain() {
    return this.page.locator('iframe[name="iframe-name"]').contentFrame()?.getByRole('main');
  }

  get iframeCoursesLink() {
    return this.page.locator('iframe[name="iframe-name"]').contentFrame()?.getByRole('link', { name: 'Courses', exact: true });
  }

  // Total Amount Text Locator
  getTotalAmountText() {
    return this.page.getByText(/Total Amount Collected/);
  }

  //Expandtesting Locators
  get usernameTextbox() {
    return this.page.getByRole('textbox', { name: 'Username' });
  }

  get passwordTextbox() {
    return this.page.getByRole('textbox', { name: 'Password' });
  }
  get loginButton() {
    return this.page.getByRole('button', { name: 'Login' });
  }
  get productList() {
    return this.page.locator('a.card:visible');
  }

  // Shopping Page Locators
  get productCard() {
    return this.page.locator('a.card:visible');
  }

  get minSlider() {
    return this.page.locator('span[role=slider].ngx-slider-pointer-min');
  }

  get maxSlider() {
    return this.page.locator('span[role=slider].ngx-slider-pointer-max');
  }

  get searchQueryInput() {
    return this.page.locator('[data-test="search-query"]');
  }

  get searchSubmitButton() {
    return this.page.locator('[data-test="search-submit"]');
  }

  get searchResultCount() {
    return this.page.getByTestId('search-result-count');
  }

  get productName() {
    return this.page.locator('[data-test="product-name"]');
  }

  get filtersSection() {
    return this.page.locator('#filters');
  }

  get navCategories() {
    return this.page.locator('[data-test="nav-categories"]');
  }

  get navRentals() {
    return this.page.locator('[data-test="nav-rentals"]');
  }

  get pageTitle() {
    return this.page.locator('[data-test="page-title"]');
  }

  get navContact() {
    return this.page.locator('[data-test="nav-contact"]');
  }

  get contactSubmitButton() {
    return this.page.locator('[data-test="contact-submit"]');
  }

  get firstNameInput() {
    return this.page.locator('[data-test="first-name"]');
  }

  get lastNameInput() {
    return this.page.locator('[data-test="last-name"]');
  }

  get emailInput() {
    return this.page.locator('[data-test="email"]');
  }

  get subjectSelect() {
    return this.page.locator('[data-test="subject"]');
  }

  get subjectError() {
    return this.page.locator('[data-test="subject-error"]');
  }

  get messageInput() {
    return this.page.locator('[data-test="message"]');
  }

  get fileInput() {
    return this.page.locator('input[type="file"]');
  }

  get navSignIn() {
    return this.page.locator('[data-test="nav-sign-in"]');
  }

  get registerLink() {
    return this.page.locator('[data-test="register-link"]');
  }

  get registerSubmitButton() {
    return this.page.locator('[data-test="register-submit"]');
  }

  get compareLink() {
    return this.page.locator('[data-test="compare-link"]');
  }

  get compareButton() {
    return this.page.locator('.compare-btn');
  }

  get cardTitle() {
    return this.page.locator('.card-title');
  }

  get clearComparisonButton() {
    return this.page.locator('[data-test="clear-comparison"]');
  }

  getFilterByText(text: string) {
    return this.page.getByText(text);
  }

  getErrorMessage(text: string) {
    return this.page.getByText(text);
  }
}
