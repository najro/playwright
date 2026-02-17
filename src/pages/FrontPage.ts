import { expect, type Locator, type Page } from "@playwright/test";
import { BasePage } from './BasePage';

export class FrontPage  extends BasePage {
  
  readonly page: Page;

  // Locators
  readonly body: Locator;
  readonly topTasks: Locator;
  readonly insightSelected: Locator;
  readonly insightSelectedGridRow: Locator;
  readonly insightSelectedCards: Locator;
  readonly contentRowWithCarouselList: Locator;
  readonly carouselList: Locator;
  readonly footer: Locator;

  constructor(page: Page) {
    super(page);
  
    this.page = page;

    this.body = page.locator("body");

    this.topTasks = page.locator("ul.top-tasks");

    this.insightSelected = page.locator(
      'div.content-section.content-col-3[data-nav="insight-selected"]'
    );
    this.insightSelectedGridRow = this.insightSelected.locator(
      ":scope div.content-grid-row"
    );
    this.insightSelectedCards = this.insightSelectedGridRow.locator(
      ":scope > div.content-section.content-col-50"
    );

    this.carouselList = page.locator("ul.link-list.carousel-linklist");
    this.contentRowWithCarouselList = page
      .locator("div.content-row")
      .filter({ has: this.carouselList });

    this.footer = page.locator("footer.page-footer");
  }

  // Actions
  async goto() {
    await this.page.goto("/", { waitUntil: "domcontentloaded" });
  }

  // Assertions / checks (POM-friendly “methods”)
  async expectBodyHasFrontpageClass() {
    await expect(this.body).toHaveClass(/(?:^|\s)page-frontpage(?:\s|$)/);
  }

  async expectTopTasks(count: number) {
    await expect(this.topTasks).toBeVisible();
    await expect(this.topTasks.locator(":scope > li")).toHaveCount(count);
  }

  async expectInsightSelectedGridRowCount(expected: number) {
    await expect(this.insightSelected).toBeVisible();
    await expect(this.insightSelectedGridRow).toHaveCount(expected);
  }

  async expectInsightSelectedCardsCount(expected: number) {
    await expect(this.insightSelectedCards).toHaveCount(expected);
  }

  async expectCarouselListInSingleContentRow() {
    await expect(this.contentRowWithCarouselList).toHaveCount(1);
    await expect(
      this.contentRowWithCarouselList.locator("ul.link-list.carousel-linklist")
    ).toBeVisible();
  }

  async expectFooterVisible() {
    await expect(this.footer).toBeVisible();
  }

  // Optional: one “sanity check” helper that mirrors your test intent
  async expectStructureSanity() {
    await this.expectBodyHasFrontpageClass();
    await this.expectTopTasks(6);
    await this.expectInsightSelectedGridRowCount(1);
    await this.expectInsightSelectedCardsCount(6);
    await this.expectCarouselListInSingleContentRow();
    await this.expectFooterVisible();
  }
}
