import { cached } from './cache';

/*
 * Публичный GitHub API без токена: 60 запросов в час с одного IP,
 * поэтому всё кэшируется в localStorage на час.
 */

export const API = 'https://api.github.com';
export const TTL_MS = 60 * 60 * 1000;

const EXCLUDED_LANGS = ['CMake', 'Papyrus', 'Makefile', 'Dockerfile', 'Shell'];
const MIN_LANG_SHARE = 0.02;

export interface Language {
  title: string;
  /** доля 0…1 */
  percent: number;
}

export interface Repo {
  name: string;
  description: string | null;
  url: string;
  /** основной язык по версии GitHub */
  language: string | null;
  languages: Language[];
  stars: number;
  updatedAt: string;
}

export interface RepoFile {
  name: string;
  /** путь от корня репозитория: src/main.go */
  path: string;
  type: 'dir' | 'file';
  /** страница файла на GitHub */
  url: string;
}

export interface Release {
  tag: string;
  name: string;
  date: string;
}

export interface RepoDetails {
  releases: Release[];
  readme: string | null;
}

export async function get<T>(url: string, accept = 'application/vnd.github+json'): Promise<T> {
  const response = await fetch(url, { headers: { Accept: accept } });
  if (!response.ok) {
    const reason = response.status === 403 ? 'лимит запросов GitHub, попробуйте позже' : '';
    throw new Error(`GitHub ${response.status} ${reason}`.trim());
  }
  return (accept.endsWith('raw') ? response.text() : response.json()) as Promise<T>;
}

interface ApiRepo {
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  pushed_at: string;
  fork: boolean;
}

async function getLanguages(user: string, repo: string): Promise<Language[]> {
  const data = await get<Record<string, number>>(`${API}/repos/${user}/${repo}/languages`);
  const entries = Object.entries(data).filter(([lang]) => !EXCLUDED_LANGS.includes(lang));
  const total = entries.reduce((sum, [, bytes]) => sum + bytes, 0);
  if (total === 0) return [];

  return entries
    .map(([title, bytes]) => ({ title, percent: bytes / total }))
    .filter((lang) => lang.percent >= MIN_LANG_SHARE)
    .sort((a, b) => b.percent - a.percent);
}

export function getRepos(user: string): Promise<Repo[]> {
  return cached(`gh:${user}:repos`, TTL_MS, async () => {
    const list = await get<ApiRepo[]>(`${API}/users/${user}/repos?sort=pushed&per_page=100`);
    const repos = list.filter((repo) => !repo.fork && repo.name !== user);

    // языки всех репозиториев параллельно; если запрос упал — без процентов
    return Promise.all(
      repos.map(async (repo) => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        languages: await getLanguages(user, repo.name).catch(() => []),
        stars: repo.stargazers_count,
        updatedAt: repo.pushed_at.slice(0, 10),
      })),
    );
  });
}

interface ApiContent {
  name: string;
  path: string;
  type: string;
  html_url: string;
}

/** содержимое каталога; path = '' — корень. Сначала папки, потом файлы, по алфавиту */
export function getContents(user: string, repo: string, path = ''): Promise<RepoFile[]> {
  return cached(`gh:${user}:${repo}:/${path}`, TTL_MS, async () => {
    const list = await get<ApiContent[]>(`${API}/repos/${user}/${repo}/contents/${path}`);
    return list
      .map<RepoFile>((item) => ({
        name: item.name,
        path: item.path,
        type: item.type === 'dir' ? 'dir' : 'file',
        url: item.html_url,
      }))
      .sort((a, b) =>
        a.type === b.type ? a.name.localeCompare(b.name) : a.type === 'dir' ? -1 : 1,
      );
  });
}

interface ApiRelease {
  tag_name: string;
  name: string | null;
  published_at: string;
}

export function getRepoDetails(user: string, repo: string): Promise<RepoDetails> {
  return cached(`gh:${user}:${repo}`, TTL_MS, async () => {
    const base = `${API}/repos/${user}/${repo}`;
    const [releases, readme] = await Promise.all([
      get<ApiRelease[]>(`${base}/releases?per_page=10`).catch(() => []),
      get<string>(`${base}/readme`, 'application/vnd.github.raw').catch(() => null),
    ]);

    return {
      releases: releases.map((release) => ({
        tag: release.tag_name,
        name: release.name ?? '',
        date: release.published_at.slice(0, 10),
      })),
      readme,
    };
  });
}
