import { test as base } from '@playwright/test';
import { AppHomePage } from '@pages/AppHomePage';

type Fixtures = {
  home: AppHomePage;
};

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => {
    await use(new AppHomePage(page));
  },
});

export { expect } from '@playwright/test';
