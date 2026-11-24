import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export const LOCALES = ['ru', 'en'] as const;
export type Locale = (typeof LOCALES)[number];

export type I18nText = string | Partial<Record<Locale, string>>;

export function translate(text: I18nText | undefined, locale: Locale): string {
  if (text == null) return '';
  if (typeof text === 'string') return text;
  return text[locale] ?? text.ru ?? Object.values(text)[0] ?? '';
}

interface I18nValue {
  locale: Locale;
  setLocale: (next: Locale) => void;

  t: (text: I18nText | undefined) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = 'mystyte.locale';

function readInitialLocale(fallback: Locale): Locale {
  if (typeof window === 'undefined') return fallback;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return (LOCALES as readonly string[]).includes(stored ?? '') ? (stored as Locale) : fallback;
}

export function I18nProvider({
  children,
  defaultLocale = 'ru',
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(() => readInitialLocale(defaultLocale));

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
    }
  }, []);

  const value = useMemo<I18nValue>(
    () => ({
      locale,
      setLocale,
      t: (text) => translate(text, locale),
    }),
    [locale, setLocale],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n должен вызываться внутри <I18nProvider>');
  return ctx;
}

export function useT() {
  return useI18n().t;
}
