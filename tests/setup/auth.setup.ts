import { test as setup } from '@playwright/test';
import { OptimizelyLoginPage } from 'src/pom/OptimizelyLoginPage';
import { env } from '@config/env';
import { authStatePathFor } from '@config/paths';

/**
 * Auth setup test.
 *
 * This file is executed by the setup projects (setup-portal, setup-admin).
 * It logs in through custom Auth and stores the resulting browser storage state
 * in a stable file, which your real test projects reuse. 
 */

setup('authenticate and save storageState', async ({ page }, testInfo) => {

  // Map setup project name -> app name used for auth storageState
  const appName = testInfo.project.name.replace(/^setup-/, '');

  const optimizelyPage = new OptimizelyLoginPage(page);


  // Start at the app base URL (will trigger redirect to Entra if unauthenticated)
  if(appName === 'editor')    {
    await optimizelyPage.loginAuto(env.OPTIMIZELY_CMS_EDITOR_TOKEN);    
  }else if(appName === 'admin'){
    await optimizelyPage.loginAuto(env.OPTIMIZELY_CMS_ADMIN_TOKEN);
  }

  await optimizelyPage.goToStartPage();

  await optimizelyPage.hideCookieBannerSelectAll();

  // Save storageState for reuse
  const storageStatePath = authStatePathFor(appName);
  await page.context().storageState({ path: storageStatePath });
  testInfo.attach('storageStatePath', { body: storageStatePath });
});
