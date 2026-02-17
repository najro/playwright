import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';

export class AppHomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async goto() {
    await this.page.goto('/start/cms');
  }

  /**
   * Generic "you're logged in" assertion.
   * Customize this for your product (e.g., a user avatar, a logout button, a known dashboard heading, etc.).
   */
  async assertNotRedirectedToLogin() {
    await expect(this.page).not.toHaveURL(/login|microsoftonline\.com|entra/i);
  }
}
