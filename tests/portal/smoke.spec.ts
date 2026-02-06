import { test, expect } from '@fixtures/index';

test.describe('Portal smoke', () => {
  test('opens home and verifies session is authenticated', async ({ home, page }) => {
    await home.goto();
    await home.assertNotRedirectedToLogin();

    // Example generic assertion: the app should render something.
    // Replace this with a stable, meaningful locator from your app (data-testid recommended).
    await expect(page.locator('body')).toBeVisible();
  });
});
