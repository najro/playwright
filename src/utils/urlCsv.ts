import fs from 'fs';
import path from 'path';

export type UrlRedirectCase = {
  url: string;
  text: string;
  input: string; // expected redirect target (path)
};

export function loadRedirectCsv(relPath: string): UrlRedirectCase[] {
    
  const csvPath = path.resolve(__dirname, relPath);
  const raw = fs.readFileSync(csvPath, 'utf-8');

  const lines = raw
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  if (lines.length < 2) return [];

  const header = lines[0].split(';').map(h => h.trim().toLowerCase());
  const idxUrl = header.indexOf('url');
  const idxText = header.indexOf('text');
  const idxInput = header.indexOf('input');

  if (idxUrl === -1 || idxText === -1 || idxInput === -1) {
    throw new Error(`CSV must contain headers: url;text;input (found: ${lines[0]})`);
  }

  return lines.slice(1).map((line, i) => {
    const cols = line.split(';');
    const row = {
      url: (cols[idxUrl] ?? '').trim(),
      text: (cols[idxText] ?? '').trim(),
      input: (cols[idxInput] ?? '').trim(),
    };
    if (!row.url || !row.input) {
      throw new Error(`Invalid CSV row at line ${i + 2}: "${line}"`);
    }
    return row;
  });
}