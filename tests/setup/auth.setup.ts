import { test as setup, expect } from '@playwright/test';
import { EntraLoginPage } from '@pages/EntraLoginPage';
import { authStatePathFor } from '@config/paths';
import { env } from '@config/env';

/**
 * Auth setup test.
 *
 * This file is executed by the setup projects (setup-portal, setup-admin).
 * It logs in through Entra ID and stores the resulting browser storage state
 * in a stable file, which your real test projects reuse.
 *
 * Why this is future-proof:
 * - Your test projects do not contain login steps.
 * - If Entra changes the login flow, you update only this file / POM.
 * - You can rotate credentials or update CA policies without touching test suites.
 */
setup('authenticate and save storageState', async ({ page }, testInfo) => {
  // Map setup project name -> app name used for auth storageState
  const appName = testInfo.project.name.replace(/^setup-/, '');

  //console.log("App name_:", appName);
  //console.log("Test info:", testInfo.project);
  
  // Start at the app base URL (will trigger redirect to Entra if unauthenticated)
  console.log("Going to page");

if(appName === 'editor' || appName === 'admin'){
  await page.goto('https://login.microsoftonline.com', { waitUntil: 'domcontentloaded' });
}else{
  await page.goto('/', { waitUntil: 'domcontentloaded' });
}

  //await page.goto('/start/cms', { waitUntil: 'domcontentloaded' });
  //await page.goto('https://mysignins.microsoft.com/security-info', { waitUntil: 'domcontentloaded' });
  //await page.goto('https://login.microsoftonline.com/', { waitUntil: 'domcontentloaded' });

  
  
  // Perform login (incl optional MFA)
  const entra = new EntraLoginPage(page);


  if (env.AUTO_LOGIN) {    
      if(appName === 'editor') {
        await entra.loginAutoMfa(env.ENTRA_EDITOR_USERNAME, env.ENTRA_EDITOR_PASSWORD, env.ENTRA_EDITOR_TOTP_SECRET);
      } else if(appName === 'admin') {
        await entra.loginAutoMfa(env.ENTRA_ADMIN_USERNAME, env.ENTRA_ADMIN_PASSWORD, env.ENTRA_ADMIN_TOTP_SECRET);
      } else if(appName === 'enduser') {
        // do nothing
      }    
  }else{
    if(appName === 'editor' || appName === 'admin'){
      await entra.loginManual();
    }    
  }

  
  // Optional: assert we're back in the app after login
  /*const postLoginPath =  appName === 'editor' || appName === 'admin' ? env.POST_LOGIN_PATH_CMS : env.POST_LOGIN_PATH_CMS;

  if (postLoginPath) {
    await expect(page).toHaveURL(new RegExp(postLoginPath.replace('/', '\\/')));
  }*/

  await page.goto('/', { waitUntil: 'domcontentloaded' });


  await entra.hideCookieBannerSelectAll();


  // Save storageState for reuse
  const storageStatePath = authStatePathFor(appName);
  await page.context().storageState({ path: storageStatePath });
  testInfo.attach('storageStatePath', { body: storageStatePath });
});
