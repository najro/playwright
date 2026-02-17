import { test } from '@playwright/test';
import { BasePage } from '../../src/pom/BasePage';
import { loadPageTypeCases } from '@utils/csvtool';

const cases = loadPageTypeCases('../../tests/data/basic-page-types-urls.csv');

test.describe('Basic Page TypeTests', () => {
  for (const tc of cases) {
    test(tc.text || `${tc.url} contains ${tc.search}`, async ({ page }) => {
      const base = await new BasePage(page).gotoUrl(tc.url);
      await base.assertHtmlLengthGreaterThan(1000);
      await base.assertHtmlContains(tc.search);
    });
  }
});