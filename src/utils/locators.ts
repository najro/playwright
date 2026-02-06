import { Page, Locator, expect } from '@playwright/test';

export async function firstVisible(page: Page, selectors: string[], timeoutMs = 10_000): Promise<Locator> {
  const start = Date.now();
  let lastError: unknown;

  for (const selector of selectors) {
    try {
      const locator = page.locator(selector);
      await expect(locator).toBeVisible({ timeout: Math.max(500, timeoutMs - (Date.now() - start)) });
      return locator;
    } catch (err) {
      lastError = err;
    }
  }

  throw new Error(`None of the selectors became visible: ${selectors.join(', ')}. Last error: ${String(lastError)}`);
}
