import { test as base, expect, type Page } from '@playwright/test';
import { PracticeLocators } from '../../Pages/locators';

const test = base.extend<{ locators: PracticeLocators }>({
  locators: async ({ page }, use) => {
    const locators = new PracticeLocators(page);
    await use(locators);
  },
});

test('Login Page', async ({ page, locators }) => {
  await page.goto('https://practice.expandtesting.com/login');

  //Invalid Password
  await locators.usernameTextbox.fill('practice');
  await locators.passwordTextbox.fill('WrongPassword!');
  await locators.loginButton.click();
  await expect(page.locator('#flash')).toContainText('Your password is invalid!');

  //Invalid Username
    await locators.usernameTextbox.fill('');
    await locators.passwordTextbox.fill('SuperSecretPassword!');
    await locators.loginButton.click();
    await expect(page.locator('#flash')).toContainText('Your username is invalid!')
    
    //Valid Credentials
    await locators.usernameTextbox.fill('practice');
    await locators.passwordTextbox.fill('SuperSecretPassword!');
    await locators.loginButton.click();
    await expect(page).toHaveURL('https://practice.expandtesting.com/secure');
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');

    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');
});

test('Register Page', async ({ page, locators }) => {
  //Non-matching passwords
  await page.goto('https://practice.expandtesting.com/register');
  const randomString = Math.random().toString(36).substring(2, 11);
  await locators.usernameTextbox.fill(randomString);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Password123');
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password456');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page.locator('#flash')).toContainText('Passwords do not match.');

    //Successful Registration
  await locators.usernameTextbox.fill(randomString);
  await page.getByRole('textbox', { name: 'Password', exact: true }).fill('Password123'); 
  await page.getByRole('textbox', { name: 'Confirm Password' }).fill('Password123');
  await page.getByRole('button', { name: 'Register' }).click();
  await expect(page).toHaveURL('https://practice.expandtesting.com/login');
  await expect(page.locator('#flash')).toContainText('Successfully registered, you can log in now.');

  // Attempt to login with the newly registered credentials
    await locators.usernameTextbox.fill(randomString);
    await locators.passwordTextbox.fill('Password123');
    await locators.loginButton.click();
    await expect(page).toHaveURL('https://practice.expandtesting.com/secure');
    await expect(page.locator('#flash')).toContainText('You logged into a secure area!');
    await page.getByRole('link', { name: 'Logout' }).click();
    await expect(page.locator('#flash')).toContainText('You logged out of the secure area!');
});

test('Slow Loading Page', async ({ page, locators }) => {
    await page.goto('https://practice.expandtesting.com/slow');
    await expect(page.getByRole('paragraph').filter({ hasText: 'The slow task has finished.' })).toBeVisible({ timeout: 10_000 });
});

test('Javascript Alerts', async ({ page, locators }) => {
    
    await page.goto('https://practice.expandtesting.com/js-dialogs');
    
    await expect(page.locator('#dialog-response')).toContainText('Waiting');
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('alert');
        expect(dialog.message()).toBe('I am a Js Alert');
        await dialog.accept();
    });
    await page.getByRole('button', { name: 'Js Alert' }).click();
    await expect(page.locator('#dialog-response')).toContainText('OK');
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('confirm');
        expect(dialog.message()).toBe('I am a Js Confirm');
        await dialog.accept();
    });
    await page.getByText('Js Alert Js Confirm Js Prompt').click();
    await expect(page.locator('#dialog-response')).toContainText('Ok');
    page.once('dialog', async dialog => {
        expect(dialog.type()).toBe('prompt');
        expect(dialog.message()).toBe('I am a Js prompt');
        await dialog.accept('Playwright');
    });
    await page.getByRole('button', { name: 'Js Prompt' }).click();
    await expect(page.locator('#dialog-response')).toContainText('Playwright');
});
