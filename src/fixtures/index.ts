import { test as base } from '@playwright/test';
import { AppHomePage } from '@pages/AppHomePage';
import { FrontPage } from '@pages/FrontPage';

type Fixtures = {
  home: AppHomePage;
  frontpage: FrontPage;
};

export const test = base.extend<Fixtures>({
  home: async ({ page }, use) => {
    await use(new AppHomePage(page));
  },
  frontpage: async ({ page }, use) => {
     const frontPage = new FrontPage(page);

    // Optional: navigate first if needed
    await frontPage.goto();

    // Hide cookie banner BEFORE test runs
    await frontPage.hideCookieBannerSelectAll();

    // Provide ready-to-use page object to test
    await use(frontPage);
  },
});

export { expect } from '@playwright/test';

