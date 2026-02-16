import { expect, Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { env } from '@config/env';
import { entraSelectors } from '@config/selectors';
import { generateTotp } from '@utils/totp';
import { firstVisible } from '@utils/locators';

export class EntraLoginPage extends BasePage {
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

    // Wait until we leave Microsoft login page
/*    await this.page.waitForURL(
      url => !url.hostname.includes('login.microsoftonline.com'),
      { timeout: 5 * 60_000 } // 5 minutes
    );*/

    await this.page.waitForURL('**/start/cms', {
      timeout: 5 * 60_000,
    });

    console.warn(
      'Have leaved the url with Microsoft login page, you can start to run your tests now.'
    );

  }

  /**
   * Drives the standard Entra ID login UX.
   * This is intentionally defensive:
   * - Entra flows can vary by tenant/policy, so we try multiple selectors.
   * - We only attempt TOTP if an OTP field is detected.
   *
   * Notes:
   * - MFA in CI usually requires a non-interactive method such as TOTP with a shared secret.
   * - If your Conditional Access requires something you can't automate (e.g., push notification),
   *   you should use a dedicated test policy/user and allow TOTP for automation.
   */
  async loginAutoMfa(entraUsername: string, entraPassword: string, entraTotp?: string) {
    // If your app redirects to Entra, we expect to land on a Microsoft login page.
    // Some apps have a "Sign in" button first; customize in your app-specific flow if needed.

    // Username
    const userInput = await firstVisible(this.page, entraSelectors.username, 20_000);
    await userInput.fill(entraUsername);
    await this.clickPrimarySubmitIfPresent();

    // Password
    const pwdInput = await firstVisible(this.page, entraSelectors.password, 20_000);
    await pwdInput.fill(entraPassword);
    await this.clickPrimarySubmitIfPresent();

    // Optional: handle "Pick an account" prompt by clicking the first matching account tile
    // (This is best-effort; safe to ignore if not shown.)
    await this.handlePickAnAccountIfPresent();
  
    // Optional: TOTP / OTP page
    await this.handleTotpIfPresent(entraTotp);

    // Optional: "Stay signed in?"
    await this.handleStaySignedInPromptIfPresent();    
  }

  private async clickPrimarySubmitIfPresent() {
    // Some Entra screens auto-advance; don't fail if the button isn't there.
    for (const selector of entraSelectors.primarySubmit) {
      const btn = this.page.locator(selector);
      if (await btn.count()) {
        if (await btn.first().isVisible()) {
          await btn.first().click();
          return;
        }
      }
    }
  }

  private async handlePickAnAccountIfPresent() {
    // Common content: "Pick an account"
    const heading = this.page.getByRole('heading', { name: /pick an account/i });
    if (await heading.isVisible().catch(() => false)) {
      // Try clicking the first account tile
      const tiles = this.page.locator('[role="listitem"], .table, .tile, .identity');
      if (await tiles.count()) {
        await tiles.first().click();
      }
    }
  }

  private async handleTotpIfPresent(entraTotp?: string) {
    const secret = entraTotp ?? "";
    
    // Wait briefly to see if OTP field shows up
    const otpLocator = this.page.locator(entraSelectors.totpCode.join(', '));

    const hasOtp = await otpLocator.first().isVisible({ timeout: 5_000 }).catch(() => false);
    if (!hasOtp) return;

    if (!secret) {
      throw new Error(
        'MFA/TOTP was requested by Entra, but ENTRA_TOTP_SECRET is not set. ' +
        'Configure a TOTP secret for your test user and set it as an environment variable.'
      );
    }

    const code = generateTotp(secret);
    await otpLocator.first().fill(code);

    // Submit (sometimes same #idSIButton9)
    await this.clickPrimarySubmitIfPresent();

    // Some flows show "Verify" button or auto-submit; ensure OTP field disappears
    await expect(otpLocator.first()).toBeHidden({ timeout: 20_000 });
  }

  private async handleStaySignedInPromptIfPresent() {
    // Common heading: "Stay signed in?"
    const heading = this.page.getByRole('heading', { name: /stay signed in/i });
    const shown = await heading.isVisible().catch(() => false);
    if (!shown) return;

    // Optionally click "Don't show this again" if present
    for (const selector of entraSelectors.dontShowAgain) {
      const cb = this.page.locator(selector);
      if (await cb.isVisible().catch(() => false)) {
        await cb.check().catch(() => {});
      }
    }

    const yesButton = this.page.getByRole('button', { name: /^yes$/i });
    const noButton = this.page.getByRole('button', { name: /^no$/i });

    if (env.ENTRA_STAY_SIGNED_IN) {
      if (await yesButton.isVisible().catch(() => false)) await yesButton.click();
      else await this.clickPrimarySubmitIfPresent();
    } else {
      if (await noButton.isVisible().catch(() => false)) await noButton.click();
      else {
        // Fallback: sometimes only one button exists
        await this.clickPrimarySubmitIfPresent();
      }
    }
  }
}
