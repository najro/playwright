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
  const banner = this.page.locator('#cookieApiData');
  const acceptAll = banner.locator('#userSelectAll');

  // If it never appears, we're done.
  try {
    await banner.waitFor({ state: 'visible', timeout: 3000 });
  } catch {
    return;
  }

  // If it's visible, try to accept
  try {
    await acceptAll.waitFor({ state: 'visible', timeout: 3000 });
    await acceptAll.click();
  } catch {
    // button missing or not clickable; don't block auth flow
    return;
  }

  // Wait for banner to close (UI confirmation)
  await banner.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => {});

  // OPTIONAL: wait for persistence, but do not require it
  await this.page.waitForFunction(
    () => document.cookie.length > 0 || Object.keys(localStorage).length > 0,
    null,
    { timeout: 2000 }
  ).catch(() => {});
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

  async expectTextToBeVisible(text: string): Promise<void> {
    await expect(this.page.getByText(text)).toBeVisible();
  }
  
}
