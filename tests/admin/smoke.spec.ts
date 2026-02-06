import { test, expect } from '@fixtures/index';

test.describe('Admin smoke', () => {
  test('opens home and verifies session is authenticated', async ({ home, page }) => {
    await home.goto();
    await home.assertNotRedirectedToLogin();

    // Replace with a stable locator from your admin UI
    await expect(page.locator('body')).toBeVisible();
  });
});
