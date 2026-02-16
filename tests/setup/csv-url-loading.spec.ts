import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const csvPath = path.resolve(__dirname, '../../urls.csv');

function readUrlsFromCsv(filePath: string): string[] {
  const content = fs.readFileSync(filePath, 'utf-8');
  return content
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith('#'));
}

const urls = readUrlsFromCsv(csvPath);

test.describe('CSV URL Loading', () => {
  urls.forEach(url => {
    test(`URL loads: ${url}`, async ({ page }) => {
      const response = await page.goto(url);
      expect(response && response.ok()).toBeTruthy();
    });
  });
});
