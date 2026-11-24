import { useEffect, useState } from 'react';
import { profile } from '../content/profile';
import {
  getContents,
  getRepoDetails,
  getRepos,
  type Repo,
  type RepoDetails,
  type RepoFile,
} from './github';

export interface Async<T> {
  data: T | null;
  error: string | null;
  loading: boolean;
}

/** Запустить промис и держать в состоянии { data, error, loading }. */
export function useAsync<T>(load: () => Promise<T>, deps: unknown[]): Async<T> {
  const [state, setState] = useState<Async<T>>({ data: null, error: null, loading: true });

  useEffect(() => {
    let alive = true;
    setState({ data: null, error: null, loading: true });
    load()
      .then((data) => alive && setState({ data, error: null, loading: false }))
      .catch(
        (error: Error) => alive && setState({ data: null, error: error.message, loading: false }),
      );
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return state;
}

/** все репозитории пользователя из profile.github */
export function useRepos(): Async<Repo[]> {
  return useAsync(() => getRepos(profile.github), []);
}

/** файлы, релизы и README одного репозитория */
export function useRepoDetails(name: string): Async<RepoDetails> {
  return useAsync(() => getRepoDetails(profile.github, name), [name]);
}

/** содержимое каталога репозитория; path = '' — корень */
export function useRepoContents(name: string, path: string): Async<RepoFile[]> {
  return useAsync(() => getContents(profile.github, name, path), [name, path]);
}
