import { defineConfig, devices } from '@playwright/test';
import { env, loadDotenv } from './src/config/env';
import { authStatePathFor } from './src/config/paths';

// Load environment variables from .env files (safe no-op in CI if variables already set)
loadDotenv();

/**
 * How this template is designed:
 * - Each app gets a pair of Playwright projects:
 *   1) setup-<app>  -> performs Entra login and saves storageState to .auth/<env>/<app>.json
 *   2) <app>        -> your real tests, depending on setup-<app> and reusing storageState
 *
 * Add more apps by copying the pattern in `projects` below.
 */
export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  use: {
    // Keep test artifacts when something fails; easy to debug locally and in CI
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    // Run headed locally by default, headless in CI by default
    headless: process.env.CI ? true : false,

    // For more deterministic runs
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },

  projects: [    
    // ---------------------------
    // Setup projects (auth)
    // ---------------------------
    {
      name: 'setup-editor',
      testMatch: /setup\/.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.BASE_URL_SITE,
      },
    }
    ,
    {
      name: 'setup-admin',
      testMatch: /setup\/.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.BASE_URL_SITE,
      },
    }
    ,
    {
      name: 'setup-visitor',
      testMatch: /setup\/.*\.setup\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.BASE_URL_SITE,
      },
    },
   
    // ---------------------------
    // Test projects
    // ---------------------------
    {
      name: 'pagetype',      
      testMatch: /pagetype\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.BASE_URL_SITE,
        storageState: authStatePathFor('editor'), // Example: pagetype tests run as authenticated editor
      },
    },
    {
      name: 'redirect',          
      testMatch: /redirect\/.*\.spec\.ts/,
      use: {
        ...devices['Desktop Chrome'],
        baseURL: env.BASE_URL_SITE,
        storageState: authStatePathFor('visitor'),
      },
    },
    {
        name: 'site',          
        testMatch: /site\/.*\.spec\.ts/,
        use: {
          ...devices['Desktop Chrome'],
          baseURL: env.BASE_URL_SITE,
          storageState: authStatePathFor('visitor'),      
        },
    }
  ],
});
