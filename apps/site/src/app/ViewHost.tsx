import { useState } from 'react';
import {
  matchPath,
  resolve,
  useI18n,
  useRouter,
  type I18nText,
  type Locale,
  type ViewContext,
} from '@mystyte/core';
import { Fields, Panel, Tabs, View, ViewBody } from '@mystyte/tui';
import { notFound } from '../views/helpers';
import { ui } from './strings';

export function ViewHost({ path: current }: { path: string }) {
  const { locale, t } = useI18n();
  const { open } = useRouter();
  const [tab, setTab] = useState<string>();

  const match = matchPath(current);

  if (!match) {
    return (
      <Panel title={current} icon="file" grow>
        <Fields items={notFound(current)} />
      </Panel>
    );
  }

  const { view, params, path } = match;
  const ctx: ViewContext = {
    params,
    locale,
    t,
    path,
    open,
  };

  const tabs = resolve(view.tabs, ctx) ?? [];
  const activeTab = tabs.find((item) => item.id === tab) ?? tabs[0];
  const content = activeTab
    ? (activeTab.render?.(ctx) ?? <Fields items={resolve(activeTab.fields, ctx)} />)
    : (view.render?.(ctx) ?? <Fields items={resolve(view.fields, ctx)} />);

  if (view.frame === false) {
    return <View $gap={8}>{content}</View>;
  }

  const body = <View>{content}</View>;

  const crumbs = resolve(view.breadcrumb, ctx) ?? [t(resolve(view.title, ctx)) || path];

  return (
    <Panel title={crumbs.map((crumb) => t(crumb))} icon={view.icon ?? 'folder'} flush grow>
      {tabs.length > 0 && (
        <Tabs
          items={tabs.map((tab) => ({ id: tab.id, label: t(tab.label) }))}
          active={activeTab?.id ?? ''}
          onChange={setTab}
        />
      )}
      <ViewBody $flush={activeTab?.flush ?? view.flush ?? false}>{body}</ViewBody>
    </Panel>
  );
}

type I18nApi = { locale: Locale; t: (text: I18nText | undefined) => string };

function contextFor(match: NonNullable<ReturnType<typeof matchPath>>, i18n: I18nApi): ViewContext {
  return {
    params: match.params,
    locale: i18n.locale,
    t: i18n.t,
    path: match.path,
    open: () => {},
  };
}

export function pathLabel(path: string, i18n: I18nApi): string {
  const match = matchPath(path);
  if (!match) return path || i18n.t(ui.notFound);
  return i18n.t(resolve(match.view.title, contextFor(match, i18n))) || match.path;
}

export function pathCrumbs(path: string, i18n: I18nApi): string {
  const match = matchPath(path);
  if (!match) return path;
  const ctx = contextFor(match, i18n);
  const crumbs = resolve(match.view.breadcrumb, ctx);
  if (crumbs?.length) return crumbs.map((crumb) => i18n.t(crumb)).join(' / ');
  return i18n.t(resolve(match.view.title, ctx)) || match.path;
}
