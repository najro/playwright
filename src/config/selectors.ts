/**
 * Central place for selectors that tend to change.
 * Keep Entra-specific selectors here, so you can update them in one place if Microsoft changes the UI.
 */
export const entraSelectors = {
  username: ['input[name="loginfmt"]', '#i0116'],
  password: ['input[name="passwd"]', '#i0118'],
  primarySubmit: ['#idSIButton9', 'input[type="submit"]'],
  totpCode: [
    // Common OTP inputs across Entra flows
    'input[name="otc"]',
    '#idTxtBx_SAOTCC_OTC',
    'input[type="tel"]',
  ],
  // Some tenants show a "Don't show this again" checkbox
  dontShowAgain: ['input[name="DontShowAgain"]', '#KmsiCheckboxField'],
};
