import { test, expect } from '@playwright/test';
//import { BasePage } from '@pages/BasePage';
import { loadRedirectCsv } from '@utils/csvtool';

const cases = loadRedirectCsv('../../tests/data/redirect-urls.csv');

test.describe('URL redirects', () => {
  for (const c of cases) {
    test(`${c.description} (${c.source} → ${c.target})`, async ({ page, baseURL }) => {
      

  const sourceUrl = new URL(c.source, baseURL).toString();
  const expectedUrl = new URL(c.target, baseURL).toString();

  if (expectedUrl.endsWith('.pdf')) {
    const [downloadOrResponse] = await Promise.all([
      Promise.race([
        page.waitForEvent('download').then(() => 'download'),
        page.waitForResponse(r => r.url() === expectedUrl).then(() => 'response'),
      ]),
      page.goto(sourceUrl, { waitUntil: 'commit', timeout: 30_000 }),
    ]);

    expect(downloadOrResponse === 'download' || downloadOrResponse === 'response').toBeTruthy();
  } else {
    await page.goto(sourceUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForURL(expectedUrl, { timeout: 30_000 });
    expect(page.url()).toBe(expectedUrl);
  }


      // if (!baseURL) throw new Error('baseURL is not set');

      // const sourceUrl = new URL(c.source, baseURL).toString();
      // const expectedUrl = new URL(c.target, baseURL).toString();

      // const resp = await page.goto(sourceUrl, { waitUntil: 'commit', timeout: 30_000 });
      // expect(resp?.url()).toBe(expectedUrl);
      
      //if (!baseURL) throw new Error('baseURL is not set in playwright.config.ts');

        //const expectedUrl = new URL(c.target, baseURL).toString();

      //const resultUrl = await new BasePage(page).goTo(c.source).then(p => p.getUrl());

      //await page.goto(c.source, { waitUntil: 'load' });
      //await expect(page).toHaveURL(expectedUrl);
        //const basePage = new BasePage(page);
        //await basePage.Page.goto(c.source, { waitUntil: 'domcontentloaded' });
        // await page.goto(c.source, { waitUntil: 'domcontentloaded' });        

        // await page.waitForURL(expectedUrl, { timeout: 30_000 });

        // const resultUrl = page.url();

        // expect(resultUrl).toBe(expectedUrl);



        
    });
  }
});
