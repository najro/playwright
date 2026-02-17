import { Page, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class RegjeringenBasePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

//   async goto(path: string): Promise<this> {
//     await this.page.goto(path, { waitUntil: 'domcontentloaded' });
//     // Replace Thread.Sleep(2000) with something deterministic:
//     await this.page.waitForLoadState('networkidle');
//     return this;
//   }

//   async renderedHtml(): Promise<string> {
//     return await this.page.content();
//   }

//   async assertHtmlLengthGreaterThan(min = 1000) {
//     const html = await this.renderedHtml();
//     expect(
//       html.length,
//       `The page had less than ${min} characters of HTML. That probably means it's down.`
//     ).toBeGreaterThan(min);
//   }

//   async assertHtmlContains(searchText: string) {
//     const html = await this.renderedHtml();
//     expect(html, `Couldn't find the expected HTML code in page source: '${searchText}'`).toContain(searchText);
//   }
}