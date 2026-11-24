import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { normalizePath } from './views';

/**
 * Простой роутер: текущий путь живёт в `location.hash` (#blog/hello),
 * поэтому работают ссылки, обновление страницы и кнопка «назад».
 */
export interface RouterValue {
  path: string;
  open: (path: string) => void;
}

const RouterContext = createContext<RouterValue | null>(null);

const readHash = () =>
  typeof window === 'undefined' ? '' : normalizePath(window.location.hash.slice(1));

export function RouterProvider({
  children,
  initialPath = 'home',
}: {
  children: ReactNode;
  initialPath?: string;
}) {
  const [path, setPath] = useState(() => readHash() || normalizePath(initialPath));

  useEffect(() => {
    const onHashChange = () => {
      const next = readHash();
      if (!next) return;
      setPath(next);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const open = useCallback((next: string) => {
    const target = normalizePath(next);
    setPath(target);
    if (readHash() !== target) window.location.hash = target;
  }, []);

  const value = useMemo<RouterValue>(() => ({ path, open }), [path, open]);

  return <RouterContext.Provider value={value}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterValue {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter должен вызываться внутри <RouterProvider>');
  return ctx;
}
