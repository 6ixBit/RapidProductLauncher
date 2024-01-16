import { expect, request, test } from '@playwright/test';
import { dashboardDefaultOrganizationIdHelper } from './helpers/dashboard-default-organization-id.helper';


const INBUCKET_URL = `http://localhost:54324`;

// eg endpoint: https://api.testmail.app/api/json?apikey=${APIKEY}&namespace=${NAMESPACE}&pretty=true
async function getConfirmEmail(username: string): Promise<{
  token: string;
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
    const token = message.body.text.match(/enter the code: ([0-9]+)/)[1]
    const url = message.body.text.match(/Log In \( (.+) \)/)[1]

    return { token, url }
  }

  throw new Error('No email received')
}

test('login works correctly', async ({ page }) => {

  await page.goto(`/settings/security`);

  // read email value in the input field
  const emailInput = page.locator('input[name="email"]');
  const emailAddress = await emailInput.getAttribute('value');

  await page.goto(`/logout`);

  await page.goto(`/login`);

  if (!emailAddress) {
    throw new Error('Email is empty');
  }

  await page.getByTestId('magic-link-form').locator('input').fill(emailAddress);
  // await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login with Magic Link' }).click();
  // check for this text - A magic link has been sent to your email!
  await page.waitForSelector('text=A magic link has been sent to your email!');
  const identifier = emailAddress.split('@')[0];
  let url;
  await expect.poll(async () => {
    try {
      const { url: urlFromCheck } = await getConfirmEmail(identifier);
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
  await dashboardDefaultOrganizationIdHelper({ page });
});
