import path from 'path';
import fs from 'fs';
import { env } from './env';

export function authDir(): string {
  const p = path.resolve(process.cwd(), '.auth', env.PW_ENV);
  fs.mkdirSync(p, { recursive: true });
  //console.log("Tryin to return auth dir ", p, "for env", env.PW_ENV);
  return p;
}

export function authStatePathFor(appName: string): string {
  //console.log("Tryin to get storagestate for ", appName);
  return path.join(authDir(), `${appName}.storageState.json`);
}
