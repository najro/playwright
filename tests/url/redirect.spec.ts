import { test, expect } from '@playwright/test';
import { BasePage } from '@pages/BasePage';
import { loadRedirectCsv } from '@utils/urlCsv';

const cases = loadRedirectCsv('../data/urls/redirect-urls.csv');
 
test.describe('URL redirects', () => {
  for (const c of cases) {
    test(`${c.text} (${c.url} → ${c.input})`, async ({ page, baseURL }) => {
      if (!baseURL) throw new Error('baseURL is not set in playwright.config.ts');

      const expectedUrl = new URL(c.input, baseURL).toString();

      const resultUrl = await new BasePage(page).goTo(c.url).then(p => p.getUrl());

      expect(resultUrl).toBe(expectedUrl);
    });
  }
});