import { test } from '@playwright/test';
import { uniqueId } from 'lodash';

test('update password should work', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/dashboard');
  // wait for the url to change to `/organization/<organizationUUID>`

  await page.goto(`/settings/security`);

  // read email value in the input field
  const emailInput = page.locator('input[name="email"]');
  const email = await emailInput.getAttribute('value');
  if (!email) {
    throw new Error('Email is empty');
  }
  const newPassword = `password-${uniqueId()}`;


  await page.fill('input[name="password"]', newPassword);
  await page.click('button:has-text("Update Password")');

  await page.waitForSelector('text=Password updated!');

  await page.goto(`/logout`);

  await page.goto(`/login`);

  await page.fill('input[data-strategy="email-password"]', email);
  // fill in the password
  await page.fill('input[name="password"]', newPassword);

  // click on button with text exact: Login
  await page.click('button:text-is("Login")')
  await page.waitForSelector('text=Logged in!')

  await page.waitForURL(`/dashboard`);
});

