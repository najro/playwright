import fs from 'fs';
import path from 'path';

export type UrlRedirectCase = {
  source: string;
  description: string;
  target: string; // expected redirect target (path)
};

export type PageTypeCase = {
  url: string;
  text: string;
  search: string;
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
  const idxUrl = header.indexOf('source');
  const idxText = header.indexOf('description');
  const idxInput = header.indexOf('target');

  if (idxUrl === -1 || idxText === -1 || idxInput === -1) {
    throw new Error(`CSV must contain headers: source;description;target (found: ${lines[0]})`);
  }

  return lines.slice(1).map((line, i) => {
    const cols = line.split(';');
    const row = {
      source: (cols[idxUrl] ?? '').trim(),
      description: (cols[idxText] ?? '').trim(),
      target: (cols[idxInput] ?? '').trim(),
    };
    if (!row.source || !row.description || !row.target) {
      throw new Error(`Invalid CSV row at line ${i + 2}: "${line}"`);
    }
    return row;
  });
}

export function loadPageTypeCases(csvFileName: string): PageTypeCase[] {
  const csvPath = path.resolve(__dirname, csvFileName);

  // Keep encoding tolerant; if you have "grå" issues, consider utf-8-sig or latin1
  const raw = fs.readFileSync(csvPath, 'utf8');

  const lines = raw
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const header = lines[0].split(';').map(h => h.trim().toLowerCase());
  const urlIdx = header.indexOf('url');
  const textIdx = header.indexOf('text');
  const searchIdx = header.indexOf('search');

  if (urlIdx === -1 || textIdx === -1 || searchIdx === -1) {
    throw new Error(`CSV header must be: url;text;search (got: ${lines[0]})`);
  }

  return lines.slice(1).map((line, i) => {
    const cols = line.split(';');

    const url = (cols[urlIdx] ?? '').trim();
    const text = (cols[textIdx] ?? '').trim();
    const search = (cols[searchIdx] ?? '').trim();

    if (!url || !search) {
      throw new Error(`Invalid CSV row ${i + 2}: "${line}"`);
    }

    return { url, text, search };
  });
}