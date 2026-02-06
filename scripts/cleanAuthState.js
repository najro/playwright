/**
 * Removes auth state files for a clean re-login.
 * Usage: npm run clean:auth
 */
const fs = require('fs');
const path = require('path');

const authDir = path.resolve(process.cwd(), '.auth');
if (!fs.existsSync(authDir)) {
  console.log('[clean:auth] No .auth directory found - nothing to clean.');
  process.exit(0);
}

fs.rmSync(authDir, { recursive: true, force: true });
console.log('[clean:auth] Removed', authDir);
