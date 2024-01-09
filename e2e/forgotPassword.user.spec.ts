import { test, expect, request } from '@playwright/test'

const INBUCKET_URL = `http://localhost:54324`;
async function getResetPasswordEmail(username: string): Promise<{
  url: string
}> {
  const requestContext = await request.newContext()
  const messages = await requestContext
    .get(`${INBUCKET_URL}/api/v1/mailbox/${username}`)
    .then((res) => res.json())
    // InBucket doesn't have any params for sorting, so here
    // we're sorting the messages by date
    .then((items) =>
      [...items].sort((a, b) => {
        if (a.date < b.date) {
          return 1
        }

        if (a.date > b.date) {
          return -1
        }

        return 0
      })
    );

  const latestMessageId = messages[0]?.id

  if (latestMessageId) {
    const message = await requestContext
      .get(
        `${INBUCKET_URL}/api/v1/mailbox/${username}/${latestMessageId}`
      )
      .then((res) => res.json())

    // We've got the latest email. We're going to use regular
    // expressions to match the bits we need.

    // match this text and extract url
    // --------------\nReset password\n--------------\n\nFollow this link to reset the password for your user:\n\nReset password ( http://127.0.0.1:54321/auth/v1/verify?token=pkce_e2df68ace87a16abf48dd04aca116f9ee35612772ab190212a27ac88&type=recovery&redirect_to=http://localhost:3000/update-password )\n\nAlternatively, enter the code: 719963
    const url = message.body.text.match(/Reset password \( (.+) \)/)[1];

    return { url }
  }

  throw new Error('No email received')
}

test('forgot password works correctly', async ({ page }) => {
  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  const constants = {
    resetPasswordConfirmation: 'A password reset link has been sent to your email!',
    resetPasswordButtonlabel: 'Reset password',
    confirmPasswordButtonLabel: 'Confirm Password',
  }

  // Start from the index page (the baseURL is set via the webServer in the playwright.config.ts)
  await page.goto('/dashboard');
  // wait for the url to change to `/organization/<organizationUUID>`
  let organizationId;
  await page.waitForURL(url => {
    const match = url.toString().match(/\/organization\/([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})/);
    if (match) {
      organizationId = match[1];
      return true;
    }
    return false;
  });

  await page.goto(`/settings/security`);

  // read email value in the input field
  const emailInput = page.locator('input[name="email"]');
  const email = await emailInput.getAttribute('value');
  await page.goto(`/logout`);

  await page.goto(`/forgot-password`);

  if (!email) {
    throw new Error('Email is empty');
  }

  await page.goto('/forgot-password')
  await page.fill('input[name="email"]', email);
  await page.click(`button:has-text("${constants.resetPasswordButtonlabel}")`);
  await page.waitForSelector(`text=${constants.resetPasswordConfirmation}`);

  let identifier = email.split('@')[0];
  let url;
  await expect.poll(async () => {
    try {
      const { url: urlFromCheck } = await getResetPasswordEmail(identifier);
      url = urlFromCheck;
      return typeof urlFromCheck;
    } catch (e) {
      return null;
    }
  }, {
    message: 'make sure the email is received',
    intervals: [1000, 2000, 5000, 10000, 20000],
  }).toBe('string')

  await page.goto(url);

  await page.waitForURL(`update-password`);

  await page.waitForSelector('text=Reset Password');

  const newPassword = 'password';
  await page.fill('input[name="password"]', newPassword);

  await page.click(`button:has-text("${constants.confirmPasswordButtonLabel}")`);
  await page.waitForURL(`/dashboard`);

  // await page.goto(`/logout`);

  // await page.goto(`/login`);

  // await page.fill('input[data-strategy="email-password"]', email);
  // // fill in the password
  // await page.fill('input[name="password"]', newPassword);

  // // click on button with text exact: Login
  // await page.click('button:text-is("Login")')

  // await page.waitForURL(`/dashboard`);
})
