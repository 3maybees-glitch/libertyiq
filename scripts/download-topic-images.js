const { createWriteStream, mkdirSync } = require('fs');
const https = require('https');
const http = require('http');
const path = require('path');

const outDir = path.join(process.cwd(), 'public', 'images', 'topics');
mkdirSync(outDir, { recursive: true });

const IMAGES = [
  { slug: 'pro-life',              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Baby_posing.jpg/640px-Baby_posing.jpg' },
  { slug: 'immigration',           url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/US_Capitol_west_side.JPG/400px-US_Capitol_west_side.JPG' },
  { slug: 'second-amendment',      url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Pump_jack_edit.jpg/400px-Pump_jack_edit.jpg' },
  { slug: 'marriage',              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Wedding_kiss.jpg/400px-Wedding_kiss.jpg' },
  { slug: 'two-sexes',             url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/USS_Ronald_Reagan_%28CVN-76%29_underway_in_the_Pacific_Ocean%2C_July_2011.jpg/400px-USS_Ronald_Reagan_%28CVN-76%29_underway_in_the_Pacific_Ocean%2C_July_2011.jpg' },
  { slug: 'pro-israel',            url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/US_Capitol_west_side.JPG/400px-US_Capitol_west_side.JPG' },
  { slug: 'national-security',     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/USS_Ronald_Reagan_%28CVN-76%29_underway_in_the_Pacific_Ocean%2C_July_2011.jpg/640px-USS_Ronald_Reagan_%28CVN-76%29_underway_in_the_Pacific_Ocean%2C_July_2011.jpg' },
  { slug: 'anti-climate-alarmism', url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Pump_jack_edit.jpg/640px-Pump_jack_edit.jpg' },
  { slug: 'limited-government',    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/US_Capitol_west_side.JPG/640px-US_Capitol_west_side.JPG' },
  { slug: 'anti-crt',              url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Baby_posing.jpg/400px-Baby_posing.jpg' },
  { slug: 'crime-and-justice',     url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Wedding_kiss.jpg/400px-Wedding_kiss.jpg' },
];

function download(url, dest, redirects) {
  redirects = redirects || 0;
  return new Promise((resolve, reject) => {
    if (redirects > 5) return reject(new Error('Too many redirects'));
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        res.resume();
        return download(res.headers.location, dest, redirects + 1).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        res.resume();
        return reject(new Error('HTTP ' + res.statusCode));
      }
      const file = createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

(async () => {
  console.log('Writing to:', outDir);
  for (const { slug, url } of IMAGES) {
    const dest = path.join(outDir, slug + '.jpg');
    try {
      process.stdout.write('Downloading ' + slug + '... ');
      await download(url, dest);
      console.log('OK');
    } catch (e) {
      console.log('FAILED: ' + e.message);
    }
  }
  console.log('Done.');
})();
