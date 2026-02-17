import { Page, expect } from '@playwright/test';
import { url } from 'inspector/promises';

export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goto() {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
  }

  async gotoUrl(url: string): Promise<this> {      
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
  
  async renderedHtml(): Promise<string> {
    return await this.page.content();
  }

  async assertHtmlLengthGreaterThan(min = 1000) {
    const html = await this.renderedHtml();
    expect(
      html.length,
      `The page had less than ${min} characters of HTML. That probably means it's down.`
    ).toBeGreaterThan(min);
  }

  async assertHtmlContains(searchText: string) {
    const html = await this.renderedHtml();
    expect(html, `Couldn't find the expected HTML code in page source: '${searchText}'`).toContain(searchText);
  }

}
