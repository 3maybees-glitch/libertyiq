const { copyFileSync, mkdirSync, existsSync, readdirSync } = require('fs');
const path = require('path');

const PROJECT = '/vercel/share/v0-project';
const scriptsDir = path.join(PROJECT, 'scripts');
const outDir = path.join(PROJECT, 'public', 'images', 'topics');

mkdirSync(outDir, { recursive: true });

const MAP = [
  ['tmp-pro-life.jpg',          'pro-life.jpg'],
  ['tmp-pro-israel.jpg',        'pro-israel.jpg'],
  ['tmp-national-security.jpg', 'national-security.jpg'],
  ['tmp-limited-government.jpg','limited-government.jpg'],
  ['tmp-second-amendment.jpg',  'second-amendment.jpg'],
  ['tmp-marriage.jpg',          'marriage.jpg'],
  ['tmp-immigration.jpg',       'immigration.jpg'],
  ['tmp-anti-climate.jpg',      'anti-climate-alarmism.jpg'],
  ['tmp-two-sexes.jpg',         'two-sexes.jpg'],
  ['tmp-anti-crt.jpg',          'anti-crt.jpg'],
  ['tmp-crime-justice.jpg',     'crime-and-justice.jpg'],
];

console.log('Scripts dir contents:', readdirSync(scriptsDir).join(', '));

for (const [src, dest] of MAP) {
  const srcPath = path.join(scriptsDir, src);
  const destPath = path.join(outDir, dest);
  if (existsSync(srcPath)) {
    copyFileSync(srcPath, destPath);
    console.log('Copied ->', dest);
  } else {
    console.log('MISSING:', srcPath);
  }
}
console.log('Done. Output:', outDir);
