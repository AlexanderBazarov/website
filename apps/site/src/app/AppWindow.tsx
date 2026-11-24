import type { ReactNode } from 'react';
import { matchPath, navViews, renderFields, resolve, useI18n, useRouter } from '@mystyte/core';
import {
  Explorer,
  Icon,
  PaneBody,
  PaneMain,
  Sidebar,
  SidebarFoot,
  Stack,
  StatusBar,
  StatusSegment,
  StatusSpacer,
  TitleBar,
  Window,
} from '@mystyte/tui';
import { profile } from '../content/profile';
import { ui } from './strings';
import { ViewHost, pathCrumbs, pathLabel } from './ViewHost';

export interface AppWindowProps {
  path: string;
  cursorId?: string;
  right?: ReactNode;
  cmdline?: ReactNode;
  isActive?: boolean;
  onHelp: () => void;
  onFocus?: () => void;
}

export function AppWindow({
  path,
  cursorId,
  right,
  cmdline,
  isActive,
  onHelp,
  onFocus,
}: AppWindowProps) {
  const { locale, t } = useI18n();
  const { open } = useRouter();
  const nav = navViews();

  const segment = path.split('/')[0];
  const activeNav = nav.find((view) => view.route.split('/')[0] === segment);

  const match = matchPath(path);
  const aside = match
    ? (resolve(match.view.aside, { params: match.params, locale, t, path: match.path, open }) ?? [])
    : [];

  return (
    <Window onMouseDown={onFocus} $active={isActive}>
      <TitleBar host={profile.host} title={pathLabel(path, { locale, t })} right={right} />

      <PaneBody>
        <Sidebar title={ui.explorer} icon="folder" flush grow>
          <Explorer
            items={nav.map((view) => ({
              id: view.id,
              label: t(view.nav!.label),
              icon: view.nav!.icon,
            }))}
            activeId={activeNav?.id}
            cursorId={cursorId}
            onSelect={(id) => {
              const view = nav.find((candidate) => candidate.id === id);
              if (view) open(view.nav?.target ?? view.route);
            }}
          />

          {aside.length > 0 && (
            <SidebarFoot>
              <Stack $gap={8}>{renderFields(aside)}</Stack>
            </SidebarFoot>
          )}
        </Sidebar>

        <PaneMain>
          <ViewHost key={path} path={path} />
        </PaneMain>
      </PaneBody>

      {cmdline}

      <StatusBar mode={ui.mode}>
        <StatusSegment title={path}>{pathCrumbs(path, { locale, t })}</StatusSegment>
        <StatusSegment optional>
          <Icon name="branch" /> {profile.branch}
        </StatusSegment>
        <StatusSpacer />
        <StatusSegment align="right" optional>
          {profile.encoding}
        </StatusSegment>
        <StatusSegment align="right" optional onClick={onHelp}>
          <Icon name="question" /> {t(ui.help)}
        </StatusSegment>
      </StatusBar>
    </Window>
  );
}
