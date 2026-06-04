import { Page } from '@playwright/test';

export class PracticeLocators {
  constructor(private page: Page) {}

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
}
