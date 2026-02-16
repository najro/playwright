import { Page } from '@playwright/test';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

 async goTo(path: string): Promise<this> {
    await this.page.goto(path);
    return this;
  }

  getUrl(): string {
    return this.page.url();
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
