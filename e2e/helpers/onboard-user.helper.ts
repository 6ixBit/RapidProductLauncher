import { Page } from "@playwright/test";

export async function onboardUserHelper({ page, name }: { page: Page, name: string }) {
  const form = await page.waitForSelector('div[role="dialog"] form[data-testid="user-onboarding-form"]');
  if (!form) {
    throw new Error('form not found');
  }
  const input = await form.waitForSelector('input[name="name"]');
  // enter text in the input field
  await input.fill(name);
  // get button with text "save"
  const submitButton = await form.waitForSelector('button:has-text("Save")');
  if (!submitButton) {
    throw new Error('submitButton not found');
  }
  await submitButton.click();

  // wait for text "Profile updated!"
  await page.waitForSelector('text=Profile updated!');
}
