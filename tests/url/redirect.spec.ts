import { test, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { loadRedirectCsv } from '@utils/csv';

const cases = loadRedirectCsv('../data/redirect-urls.csv');
 
test.describe('URL redirects', () => {
  for (const c of cases) {
    test(`${c.description} (${c.source} → ${c.target})`, async ({ page, baseURL }) => {
      if (!baseURL) throw new Error('baseURL is not set in playwright.config.ts');

      const expectedUrl = new URL(c.target, baseURL).toString();

      const resultUrl = await new BasePage(page).goTo(c.source).then(p => p.getUrl());

      //await page.goto(c.source, { waitUntil: 'load' });
      //await expect(page).toHaveURL(expectedUrl);


      expect(resultUrl).toBe(expectedUrl);
    });
  }
});
