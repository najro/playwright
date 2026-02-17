import { test as base } from '@playwright/test';
import { AppHomePage } from 'src/pom/AppHomePage';
import { FrontPage } from 'src/pom/FrontPage';
import { CalendarPage } from 'src/pom/CalendarPage';

type Fixtures = {
  home: AppHomePage;
  frontpage: FrontPage;
  calendarpage: CalendarPage;
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
  calendarpage: async ({ page }, use) => {
    const calPage = new CalendarPage(page);
    await calPage.goto();
    await calPage.hideCookieBannerSelectAll();
    await use(calPage);
  },
});

export { expect } from '@playwright/test';

