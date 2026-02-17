import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from './BasePage';

export class CalendarPage  extends BasePage {
  
  readonly page: Page;

  // locators
  readonly showMoreButton: Locator;
  
  // constructor
  constructor(page: Page) {
    super(page);
  
    this.page = page;
    this.showMoreButton = page.locator(".btn-show-more");
  }

  
  async clickShowMoreButton(): Promise<CalendarPage> {
    // Scroll to bottom
    await this.page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));

    // Wait and click
    await expect(this.showMoreButton).toBeVisible();
    await this.showMoreButton.click();

    return this;
  }
 
}