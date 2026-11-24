/**
 * Загружает посты с tabun.everypony.ru в блог сайта.
 *
 *   npm run sync:tabun
 *
 * 1. Читает RSS автора — список постов, даты, теги.
 * 2. Для каждого поста открывает его страницу: в RSS текст обрезан на «Читать дальше».
 * 3. Переводит HTML поста в поля сайта (rich, image, spoiler, list, code…).
 * 4. Пишет apps/site/src/content/tabun.ts — его импортирует content/blog.ts.
 *
 * Из браузера так сделать нельзя: tabun не отдаёт CORS-заголовки.
 * Ограничение RSS: в ленте только последние ~20 постов. Уже скачанные посты из
 * tabun.ts не теряются — скрипт дописывает новые и обновляет существующие.
 */

import { readFile, writeFile } from 'node:fs/promises';

const USER = 'sanya_fritz';
const ORIGIN = 'https://tabun.everypony.ru';
const RSS = `${ORIGIN}/rss/personal_blog/${USER}/`;
const OUT = new URL('../apps/site/src/content/tabun.ts', import.meta.url);
const DELAY_MS = 600;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function get(url: string): Promise<string> {
  const res = await fetch(url, { headers: { 'User-Agent': 'mystyte-blog-sync' } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}: ${url}`);
  return res.text();
}

type Inline = string | { text: string; href?: string; strong?: boolean };
type I18n = string | { ru: string; en?: string };
type Field = { type: string; [key: string]: unknown };

interface Post {
  slug: string;
  title: string;
  date?: string;
  tag?: string;
  icon: string;
  desc?: string;
  body: Field[];
}

interface El {
  tag: string;
  attrs: Record<string, string>;
  children: Node[];
}
type Node = El | string;

const VOID = new Set(['br', 'img', 'hr', 'input', 'meta', 'link', 'source', 'wbr', 'col', 'area']);

const ENTITIES: Record<string, string> = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  laquo: '«', raquo: '»', mdash: '—', ndash: '–', hellip: '…', copy: '©',
  ldquo: '“', rdquo: '”', lsquo: '‘', rsquo: '’', bull: '•', middot: '·',
};

function decode(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (whole, code: string) => {
    if (code[0] === '#') {
      const n = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(n) ? String.fromCodePoint(n) : whole;
    }
    return ENTITIES[code.toLowerCase()] ?? whole;
  });
}

function parseAttrs(raw: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  for (const m of raw.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    attrs[m[1]!.toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  }
  return attrs;
}

/** HTML → дерево. Незакрытые теги закрываются сами, лишние закрывающие игнорируются. */
function parseHtml(source: string): Node[] {
  const html = source.replace(/\r\n?/g, '\n');
  const root: El = { tag: '#root', attrs: {}, children: [] };
  const stack: El[] = [root];
  const token = /<!--[\s\S]*?-->|<\/([a-zA-Z][\w-]*)\s*>|<([a-zA-Z][\w-]*)((?:[^>"']|"[^"]*"|'[^']*')*)>|[^<]+|</g;

  for (const m of html.matchAll(token)) {
    const top = stack[stack.length - 1]!;
    const [whole, close, open, rawAttrs] = m;
    if (whole.startsWith('<!--')) continue;

    if (close) {
      const tag = close.toLowerCase();
      let at = stack.length - 1;
      while (at > 0 && stack[at]!.tag !== tag) at -= 1;
      if (at > 0) stack.length = at;
    } else if (open) {
      const tag = open.toLowerCase();
      const el: El = { tag, attrs: parseAttrs(rawAttrs ?? ''), children: [] };
      top.children.push(el);
      if (!VOID.has(tag) && !(rawAttrs ?? '').trimEnd().endsWith('/')) stack.push(el);
    } else {
      top.children.push(decode(whole));
    }
  }
  return root.children;
}

function textOf(node: Node): string {
  return typeof node === 'string' ? node : node.children.map(textOf).join('');
}

function hasClass(el: El, name: string): boolean {
  return (el.attrs.class ?? '').split(/\s+/).includes(name);
}

function find(nodes: Node[], test: (el: El) => boolean): El | undefined {
  for (const node of nodes) {
    if (typeof node === 'string') continue;
    if (test(node)) return node;
    const inner = find(node.children, test);
    if (inner) return inner;
  }
  return undefined;
}

function absolute(url: string): string {
  if (url.startsWith('//')) return `https:${url}`;
  if (url.startsWith('/')) return `${ORIGIN}${url}`;
  return url;
}

function toFields(nodes: Node[]): Field[] {
  const out: Field[] = [];
  let parts: Inline[] = [];
  let breaks = 0;

  const flush = () => {
    // склеиваем соседние строки и убираем переносы по краям
    const merged: Inline[] = [];
    for (const part of parts) {
      const last = merged[merged.length - 1];
      if (typeof part === 'string' && typeof last === 'string') merged[merged.length - 1] = last + part;
      else merged.push(part);
    }
    // пробелы вокруг переноса строки — это отступы исходника
    for (let i = 0; i < merged.length; i += 1) {
      const part = merged[i];
      if (typeof part === 'string') merged[i] = part.replace(/[ \t]*\n[ \t]*/g, '\n');
    }
    const first = merged[0];
    if (typeof first === 'string') merged[0] = first.replace(/^\s+/, '');
    const lastIndex = merged.length - 1;
    const last = merged[lastIndex];
    if (typeof last === 'string') merged[lastIndex] = last.replace(/\s+$/, '');
    const cleaned = merged.filter((part) => part !== '');

    const hasText = cleaned.some((part) => (typeof part === 'string' ? part.trim() : part.text.trim()));
    if (hasText) out.push({ type: 'rich', parts: cleaned });
    parts = [];
    breaks = 0;
  };

  const block = (field: Field) => {
    flush();
    out.push(field);
  };

  const walk = (node: Node, strong: boolean) => {
    if (typeof node === 'string') {
      // переносы в исходнике — просто форматирование, значимы только <br>
      const text = node.replace(/\s+/g, ' ');
      if (text.trim()) breaks = 0;
      parts.push(strong && text.trim() ? { text, strong: true } : text);
      return;
    }

    const { tag, attrs, children } = node;

    switch (tag) {
      case 'br':
        breaks += 1;
        if (breaks >= 2) flush();
        else parts.push('\n');
        return;

      case 'img': {
        const src = attrs.src || attrs['data-src'];
        if (src) block({ type: 'image', src: absolute(src), ...(attrs.title ? { caption: attrs.title } : {}) });
        return;
      }

      case 'iframe': {
        const src = attrs.src || attrs['data-src'];
        if (src) block({ type: 'embed', src: absolute(src) });
        return;
      }

      case 'hr':
        block({ type: 'divider' });
        return;

      case 'pre':
        block({ type: 'code', code: textOf(node).replace(/^\n/, '').replace(/\s+$/, ''), lang: 'text' });
        return;

      case 'h1': case 'h2': case 'h3': case 'h4': case 'h5': case 'h6': {
        const text = textOf(node).replace(/\s+/g, ' ').trim();
        if (text) block({ type: 'heading', text, level: 3, hash: false });
        return;
      }

      case 'ul':
      case 'ol': {
        const items = children
          .filter((child): child is El => typeof child !== 'string' && child.tag === 'li')
          .map((li) => toFields(li.children));
        // текст, ошибочно попавший между </li> и </ul>, не теряем
        const stray = children.filter((child) => typeof child === 'string' || child.tag !== 'li');
        block({ type: 'list', ...(tag === 'ol' ? { ordered: true } : {}), items });
        stray.forEach((child) => walk(child, strong));
        return;
      }

      case 'a': {
        if (attrs.id === 'cut' || attrs.name === 'cut') return; // маркер ката
        const onlyText = children.every((child) => typeof child === 'string' || child.tag === 'strong' || child.tag === 'b');
        if (attrs.href && onlyText) {
          const text = textOf(node).replace(/\s+/g, ' ');
          if (text.trim()) {
            breaks = 0;
            parts.push({ text, href: absolute(attrs.href), ...(strong ? { strong: true } : {}) });
          }
          return;
        }
        children.forEach((child) => walk(child, strong));
        return;
      }

      case 'strong':
      case 'b':
        children.forEach((child) => walk(child, true));
        return;

      case 'span':
        if (hasClass(node, 'spoiler')) {
          const titleEl = find(children, (el) => hasClass(el, 'spoiler-title'));
          const bodyEl = find(children, (el) => hasClass(el, 'spoiler-body'));
          const title = titleEl ? textOf(titleEl).trim() : '';
          block({ type: 'spoiler', title: title || 'спойлер', items: toFields(bodyEl?.children ?? []) });
          return;
        }
        children.forEach((child) => walk(child, strong));
        return;

      case 'div':
      case 'p':
      case 'blockquote':
        flush();
        children.forEach((child) => walk(child, strong));
        flush();
        return;

      case 'script':
      case 'style':
        return;

      default:
        children.forEach((child) => walk(child, strong));
    }
  };

  nodes.forEach((node) => walk(node, false));
  flush();
  return out;
}

interface FeedItem {
  title: string;
  url: string;
  date?: string;
  tags: string[];
  preview: string;
}

function tagText(xml: string, tag: string): string | undefined {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`));
  if (!m) return undefined;
  const raw = m[1]!.trim();
  const cdata = raw.match(/^<!\[CDATA\[([\s\S]*)\]\]>$/);
  return cdata ? cdata[1]! : decode(raw);
}

async function readFeed(): Promise<FeedItem[]> {
  const xml = await get(RSS);
  return [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)].map(([, item]) => {
    const pub = tagText(item!, 'pubDate');
    return {
      title: tagText(item!, 'title') ?? '',
      url: tagText(item!, 'link') ?? '',
      date: pub ? localDate(pub) : undefined,
      tags: [...item!.matchAll(/<category>([\s\S]*?)<\/category>/g)].map(([, tag]) => decode(tag!).trim()),
      preview: tagText(item!, 'description') ?? '',
    };
  });
}

/** «Sat, 06 Dec 2025 21:29:46 +0300» → «2025-12-06» по времени автора, а не UTC */
function localDate(rfc822: string): string | undefined {
  const m = rfc822.match(/(\d{1,2}) (\w{3}) (\d{4})/);
  if (!m) return undefined;
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = months.indexOf(m[2]!) + 1;
  if (!month) return undefined;
  return `${m[3]}-${String(month).padStart(2, '0')}-${m[1]!.padStart(2, '0')}`;
}

interface Page {
  content?: Node[];
  blog?: string;
  date?: string;
}

async function readPage(url: string): Promise<Page> {
  const html = await get(url);
  const start = html.indexOf('<div class="topic-content text">');
  const end = html.indexOf('<footer class="topic-footer">', start);
  const tree = start >= 0 && end > start ? parseHtml(html.slice(start, end)) : [];
  const contentEl = find(tree, (el) => el.tag === 'div' && hasClass(el, 'topic-content'));

  return {
    content: contentEl?.children,
    blog: html.match(/<span class="blog-title"[^>]*>([^<]+)<\/span>/)?.[1]?.trim(),
    date: html.match(/class="topic-info-date" datetime="(\d{4}-\d{2}-\d{2})/)?.[1],
  };
}

const hashtag = (tag: string) => `#${tag.toLowerCase().replace(/\s+/g, '-')}`;

function plain(fields: Field[]): string {
  for (const field of fields) {
    if (field.type !== 'rich') continue;
    const text = (field.parts as Inline[])
      .map((part) => (typeof part === 'string' ? part : part.text))
      .join('')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) return text;
  }
  return '';
}

function shorten(text: string, max = 140): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max).replace(/\s+\S*$/, '')}…`;
}

function buildPost(item: FeedItem, page: Page): Post {
  const id = item.url.match(/(\d+)\.html/)?.[1] ?? item.url;
  const date = page.date ?? item.date;
  // если страницу не удалось разобрать — хотя бы превью из RSS
  const content = toFields(page.content ?? parseHtml(item.preview.replace(/<a[^>]*#cut[^>]*>[\s\S]*?<\/a>/, '')));

  const badges: { label: I18n; tone: string }[] = [
    ...(date ? [{ label: date, tone: 'muted' }] : []),
    ...item.tags.map((tag) => ({ label: hashtag(tag), tone: 'accent' })),
    ...(page.blog ? [{ label: page.blog, tone: 'muted' }] : []),
  ];

  return {
    slug: `tabun-${id}`,
    title: item.title,
    ...(date ? { date } : {}),
    ...(item.tags[0] ? { tag: hashtag(item.tags[0]) } : {}),
    icon: 'file',
    ...(plain(content) ? { desc: shorten(plain(content)) } : {}),
    body: [
      { type: 'heading', text: item.title, level: 2 },
      { type: 'badges', items: badges },
      ...content,
      { type: 'divider' },
      {
        type: 'actions',
        items: [
          {
            label: { ru: 'оригинал и комментарии на tabun', en: 'original and comments on tabun' },
            href: item.url,
            external: true,
            variant: 'ghost',
          },
        ],
      },
    ],
  };
}

async function previousPosts(): Promise<Post[]> {
  try {
    const source = await readFile(OUT, 'utf8');
    const json = source.slice(source.indexOf('= [') + 2, source.lastIndexOf(']') + 1);
    return JSON.parse(json) as Post[];
  } catch {
    return [];
  }
}

async function main() {
  const feed = await readFeed();
  console.log(`RSS: ${feed.length} постов`);

  const fresh: Post[] = [];
  for (const item of feed) {
    process.stdout.write(`→ ${item.title} … `);
    try {
      fresh.push(buildPost(item, await readPage(item.url)));
      console.log('ok');
    } catch (error) {
      console.log(`страница не открылась (${(error as Error).message}), беру превью из RSS`);
      fresh.push(buildPost(item, {}));
    }
    await sleep(DELAY_MS);
  }

  // старые посты, которые уже выпали из RSS, сохраняем
  const bySlug = new Map((await previousPosts()).map((post) => [post.slug, post]));
  for (const post of fresh) bySlug.set(post.slug, post);
  const posts = [...bySlug.values()].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));

  const file = [
    '/* Сгенерировано scripts/tabun.ts — не редактируйте руками.',
    ' * Обновить: npm run sync:tabun */',
    "import type { Entry } from './types';",
    '',
    `export const tabunPosts: Entry[] = ${JSON.stringify(posts, null, 2)};`,
    '',
  ].join('\n');

  await writeFile(OUT, file);
  console.log(`готово: ${posts.length} постов → ${OUT.pathname}`);
}

await main();
