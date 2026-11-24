import type { ReactNode } from 'react';
import type { Field } from './fields';
import type { I18nText, Locale } from './i18n';

export type Params = Record<string, string>;

export interface ViewContext<P extends Params = Params> {
  params: P;
  locale: Locale;
  t: (text: I18nText | undefined) => string;

  open: (path: string) => void;

  path: string;
}

export type Dynamic<T, P extends Params = Params> = T | ((ctx: ViewContext<P>) => T);

export function resolve<T, P extends Params>(
  value: Dynamic<T, P> | undefined,
  ctx: ViewContext<P>,
): T | undefined {
  return typeof value === 'function' ? (value as (c: ViewContext<P>) => T)(ctx) : value;
}

export interface ViewTab<P extends Params = Params> {
  id: string;
  label: I18nText;

  flush?: boolean;

  fields?: Dynamic<Field[], P>;

  render?: (ctx: ViewContext<P>) => ReactNode;
}

export interface NavEntry {
  label: I18nText;

  icon?: string;

  order?: number;

  target?: string;
}

export interface ViewDef<P extends Params = Params> {
  id: string;

  route: string;

  title: Dynamic<I18nText, P>;

  breadcrumb?: Dynamic<I18nText[], P>;

  icon?: string;

  nav?: NavEntry;

  frame?: boolean;

  flush?: boolean;

  tabs?: Dynamic<ViewTab<P>[], P>;

  fields?: Dynamic<Field[], P>;

  render?: (ctx: ViewContext<P>) => ReactNode;

  aside?: Dynamic<Field[], P>;
}

const views = new Map<string, ViewDef<any>>();

export function defineView<P extends Params = Params>(def: ViewDef<P>): ViewDef<P> {
  return def;
}

export function registerView<P extends Params>(def: ViewDef<P>): void {
  views.set(def.id, def as ViewDef<any>);
}

export function registerViews(defs: readonly ViewDef<any>[]): void {
  for (const def of defs) registerView(def);
}

export function allViews(): ViewDef<any>[] {
  return [...views.values()];
}

export function getView(id: string): ViewDef<any> | undefined {
  return views.get(id);
}

export function navViews(): ViewDef<any>[] {
  return allViews()
    .filter((v) => v.nav)
    .sort((a, b) => (a.nav!.order ?? 100) - (b.nav!.order ?? 100));
}

export function normalizePath(path: string): string {
  return path
    .replace(/^[#/]+/, '')

    .replace(/\/+$/, '')
    .trim();
}

export interface RouteMatch {
  view: ViewDef<any>;
  params: Params;
  path: string;
}

function matchRoute(route: string, path: string): Params | null {
  const routeParts = route.split('/').filter(Boolean);
  const pathParts = path.split('/').filter(Boolean);
  if (routeParts.length !== pathParts.length) return null;
  const params: Params = {};
  for (let i = 0; i < routeParts.length; i += 1) {
    const r = routeParts[i]!;
    const p = pathParts[i]!;
    if (r.startsWith(':')) params[r.slice(1)] = decodeURIComponent(p);
    else if (r !== p) return null;
  }
  return params;
}

export function matchPath(rawPath: string): RouteMatch | null {
  const path = normalizePath(rawPath);
  const candidates = allViews()
    .map((view) => ({ view, params: matchRoute(view.route, path) }))
    .filter((entry): entry is { view: ViewDef<any>; params: Params } => entry.params !== null)
    .sort((a, b) => Object.keys(a.params).length - Object.keys(b.params).length);
  const best = candidates[0];
  return best ? { view: best.view, params: best.params, path } : null;
}
