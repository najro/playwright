import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '@config/env';
import { entraSelectors } from '@config/selectors';
import { firstVisible } from '@utils/locators';

export class OptimizelyLoginPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async loginManual() {
    console.warn(
      'Manual login mode: Please complete username, password and MFA in the browser.'
    );

    // If running with PWDEBUG=1 this is super helpful
    if (process.env.PWDEBUG) {
      await this.page.pause();
    }



    await this.page.waitForURL('**/start/cms', {
      timeout: 5 * 60_000,
    });

    console.warn(
      'Have leaved the url with Microsoft login page, you can start to run your tests now.'
    );

  }

  async goToStartPage() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
  }
  
  async loginAuto(roleToken?: string) {    
    // go to impersonation URL to trigger login
    await this.page.goto(`/user/impersonate?roletoken=${roleToken || env.OPTIMIZELY_CMS_EDITOR_TOKEN}`, { waitUntil: 'domcontentloaded' });        
  }

  




}
