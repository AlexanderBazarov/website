/**
 * Забирает закреплённые репозитории со страницы профиля GitHub.
 *
 *   npm run sync:pinned
 *
 * Пишет apps/site/src/content/pinned.ts — его показывает вкладка projects/.
 *
 * Почему скрипт, а не запрос из браузера: в REST API закреплённых репозиториев нет,
 * GraphQL требует токен, а страницу github.com браузер не прочитает из-за CORS.
 * Поэтому HTML профиля разбирается здесь, при сборке. Если GitHub поменяет
 * разметку, скрипт упадёт с понятной ошибкой, а старый pinned.ts останется.
 */

import { writeFile } from 'node:fs/promises';

/** логин на GitHub — тот же, что profile.github */
const USER = 'AlexanderBazarov';
const OUT = new URL('../apps/site/src/content/pinned.ts', import.meta.url);

interface Pinned {
  owner: string;
  name: string;
  description: string | null;
  language: string | null;
  stars: number;
}

function decode(text: string): string {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .trim();
}

function parse(html: string): Pinned[] {
  // каждая карточка — <li class="… pinned-item-list-item …"> … </li>
  const cards = html.split(/<li\b[^>]*class="[^"]*\bpinned-item-list-item\b/).slice(1);

  return cards.map((card) => {
    const body = card.slice(0, card.indexOf('</li>'));

    const href = body.match(/href="\/([^/"]+)\/([^/"]+)"[^>]*>\s*<span class="repo"/);
    if (!href) throw new Error('в карточке не найдена ссылка на репозиторий');

    const desc = body.match(/class="pinned-item-desc[^"]*">([\s\S]*?)<\/p>/)?.[1];
    const lang = body.match(/itemprop="programmingLanguage">([^<]*)</)?.[1];
    const stars = body.match(/\/stargazers"[\s\S]*?<\/svg>\s*([\d,]+)/)?.[1];

    return {
      owner: href[1],
      name: href[2],
      description: desc ? decode(desc.replace(/<[^>]+>/g, '')) || null : null,
      language: lang ? decode(lang) : null,
      stars: stars ? Number(stars.replace(/,/g, '')) : 0,
    };
  });
}

async function main() {
  const res = await fetch(`https://github.com/${USER}`, {
    headers: { 'User-Agent': 'mystyte-pinned-sync', Accept: 'text/html' },
  });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const pinned = parse(await res.text());
  if (pinned.length === 0) {
    throw new Error('закреплённых репозиториев не найдено — возможно, GitHub поменял разметку');
  }

  const file = [
    '/* Сгенерировано scripts/github-pinned.ts — не редактируйте руками.',
    ' * Обновить: npm run sync:pinned */',
    '',
    'export interface PinnedRepo {',
    '  owner: string;',
    '  name: string;',
    '  description: string | null;',
    '  language: string | null;',
    '  stars: number;',
    '}',
    '',
    `export const pinned: PinnedRepo[] = ${JSON.stringify(pinned, null, 2)};`,
    '',
  ].join('\n');

  await writeFile(OUT, file);
  for (const repo of pinned) console.log(`  ${repo.owner}/${repo.name}`);
  console.log(`готово: ${pinned.length} → ${OUT.pathname}`);
}

await main();
