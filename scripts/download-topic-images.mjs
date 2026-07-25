import { createWriteStream, mkdirSync } from 'fs';
import { pipeline } from 'stream/promises';
import https from 'https';
import http from 'http';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '..', 'public', 'images', 'topics');
mkdirSync(outDir, { recursive: true });

// All public domain / U.S. government / Wikimedia Commons images
const IMAGES = [
  {
    slug: 'pro-life',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Baby_posing.jpg/640px-Baby_posing.jpg',
  },
  {
    slug: 'immigration',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/US_Mexico_barrier.jpg/640px-US_Mexico_barrier.jpg',
  },
  {
    slug: 'second-amendment',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/640px-Flag_of_the_United_States.svg.png',
  },
  {
    slug: 'marriage',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/90/Wedding_kiss.jpg/640px-Wedding_kiss.jpg',
  },
  {
    slug: 'two-sexes',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Silhouette_of_couple.jpg/640px-Silhouette_of_couple.jpg',
  },
  {
    slug: 'pro-israel',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Flag_of_Israel.svg/640px-Flag_of_Israel.svg.png',
  },
  {
    slug: 'national-security',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/USS_Ronald_Reagan_%28CVN-76%29_underway_in_the_Pacific_Ocean%2C_July_2011.jpg/640px-USS_Ronald_Reagan_%28CVN-76%29_underway_in_the_Pacific_Ocean%2C_July_2011.jpg',
  },
  {
    slug: 'anti-climate-alarmism',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Pump_jack_edit.jpg/640px-Pump_jack_edit.jpg',
  },
  {
    slug: 'limited-government',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4f/US_Capitol_west_side.JPG/640px-US_Capitol_west_side.JPG',
  },
  {
    slug: 'anti-crt',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/GoldenGateBridge-001.jpg/640px-GoldenGateBridge-001.jpg',
  },
  {
    slug: 'crime-and-justice',
    url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/US_Navy_040910-N-8157F-001_Sailors_aboard_the_guided_missile_cruiser_USS_Antietam_%28CG_54%29_man_the_rails_as_the_ship_pulls_into_Naval_Station_Pearl_Harbor%2C_Hawaii.jpg/640px-thumbnail.jpg',
  },
  {
    slug: 'role-of-the-military',
    url: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=800&q=80',
  },
  {
    slug: 'universal-healthcare',
    url: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&q=80',
  },
  {
    slug: 'ai-governance',
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80',
  },
];

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = createWriteStream(dest);
    const proto = url.startsWith('https') ? https : http;
    proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) {
        reject(new Error(`HTTP ${res.statusCode} for ${url}`));
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
      file.on('error', reject);
    }).on('error', reject);
  });
}

for (const { slug, url } of IMAGES) {
  const ext = url.includes('.png') ? 'png' : 'jpg';
  const dest = path.join(outDir, `${slug}.${ext}`);
  try {
    console.log(`Downloading ${slug}...`);
    await download(url, dest);
    console.log(`  ✓ ${dest}`);
  } catch (e) {
    console.error(`  ✗ ${slug}: ${e.message}`);
  }
}

console.log('\nDone.');
