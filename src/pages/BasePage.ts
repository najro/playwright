import { Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }


  async hideCookieBannerSelectAll() {
      const cookieBanner = this.page.locator('#cookieApiData');

      if (await cookieBanner.isVisible()) {
      
        const acceptAllButton = cookieBanner.locator('#userSelectAll');
      
        if (await acceptAllButton.isVisible()) {
          await acceptAllButton.click();
        } 
      }
  }


}
