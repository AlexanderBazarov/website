import {
  allViews,
  matchPath,
  normalizePath,
  translate,
  type I18nText,
  type Locale,
} from '@mystyte/core';

export interface CommandApi {
  locale: Locale;
  currentPath: string;
  open: (path: string) => void;
  setLocale: (locale: Locale) => void;
  toggleHelp: () => void;
}

export function resolvePath(input: string, currentPath: string): string | null {
  const raw = normalizePath(input.replace(/^~\//, '').replace(/^\.\//, ''));
  if (!raw || raw === '~') return 'home';

  if (raw === '..') {
    const parts = currentPath.split('/').filter(Boolean);
    parts.pop();
    return parts.length ? parts.join('/') : 'home';
  }

  const direct = matchPath(raw);
  if (direct) return direct.path;

  const withoutSlash = raw.replace(/\/$/, '');
  const bySlash = matchPath(withoutSlash);
  if (bySlash) return bySlash.path;

  const needle = withoutSlash.toLowerCase();
  const view = allViews().find((candidate) => {
    const route = candidate.route.toLowerCase();
    if (route === needle || route.startsWith(`${needle}/`)) return true;
    return !route.includes(':') && route.includes(needle);
  });
  return view && !view.route.includes(':') ? view.route : null;
}

export function runCommand(input: string, api: CommandApi): I18nText | null {
  const [head = '', ...rest] = input.trim().split(/\s+/);
  const arg = rest.join(' ');
  const cmd = head.toLowerCase();
  const fail = (): I18nText => ({
    ru: `нет такого пути: ${arg || input}`,
    en: `no such path: ${arg || input}`,
  });

  switch (cmd) {
    case 'cd':
    case 'open':
    case 'go': {
      const path = resolvePath(arg, api.currentPath);
      if (!path) return fail();
      api.open(path);
      return null;
    }
    case 'ls':
    case 'tree':
      api.open('home');
      return null;
    case 'lang': {
      const next = arg.toLowerCase();
      if (next !== 'ru' && next !== 'en') return { ru: 'языки: ru, en', en: 'languages: ru, en' };
      api.setLocale(next);
      return null;
    }
    case 'help':
    case '?':
      api.toggleHelp();
      return null;
    case 'whoami':
      api.open('about.md');
      return null;
    case 'home':
      api.open('home');
      return null;
    default: {
      const path = resolvePath(input, api.currentPath);
      if (path) {
        api.open(path);
        return null;
      }
      return {
        ru: `${translate({ ru: 'неизвестная команда', en: 'unknown command' }, api.locale)}: ${head}`,
        en: `unknown command: ${head}`,
      };
    }
  }
}
