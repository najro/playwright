import { Page } from '@playwright/test';
import { url } from 'inspector/promises';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

 async goTo(url: string): Promise<this> {
    //await this.page.goto(path);

    //await this.page.goto(url, { waitUntil: 'load' });
    //await this.page.waitForLoadState('networkidle');

    console.log(`Navigating to ${url}...`);
    
    await this.page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 60000,
    });

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
