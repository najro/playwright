import { authenticator } from '@otplib/preset-default';

/**
 * Generates a TOTP code from a shared secret (RFC 6238).
 * Requires ENTRA_TOTP_SECRET to be configured for the test user.
 */
export function generateTotp(secret: string): string {
  // Entra commonly uses 30s steps and 6 digits; otplib defaults match most setups.
  return authenticator.generate(secret);
}
