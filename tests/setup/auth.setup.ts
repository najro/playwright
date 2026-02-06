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
  await page.goto('/start/cms', { waitUntil: 'domcontentloaded' });

  // Perform login (incl optional MFA)
  const entra = new EntraLoginPage(page);
  await entra.loginWithOptionalMfa();

  // Optional: assert we're back in the app after login
  const postLoginPath =
    appName === 'portal' ? env.POST_LOGIN_PATH_PORTAL : env.POST_LOGIN_PATH_ADMIN;

  if (postLoginPath) {
    await expect(page).toHaveURL(new RegExp(postLoginPath.replace('/', '\\/')));
  }

  // Save storageState for reuse
  const storageStatePath = authStatePathFor(appName);
  await page.context().storageState({ path: storageStatePath });
  testInfo.attach('storageStatePath', { body: storageStatePath });
});
