import { test } from '@playwright/test';
import { RegjeringenBasePage } from '../../src/pages/RegjeringenBasePage';
import { loadPageTypeCases } from '@utils/csv';

const cases = loadPageTypeCases('../data/test-cases.csv');

test.describe('BasicPageTypeTests', () => {
  for (const tc of cases) {
    test(tc.text || `${tc.url} contains ${tc.search}`, async ({ page }) => {
      const base = await new RegjeringenBasePage(page).goto(tc.url);

      await base.assertHtmlLengthGreaterThan(1000);
      await base.assertHtmlContains(tc.search);
    });
  }
});