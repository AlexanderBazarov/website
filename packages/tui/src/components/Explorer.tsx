import { useEffect, useRef, type ReactNode } from 'react';
import styled from 'styled-components';
import { Icon, type IconName } from './Icon';

export const ExplorerList = styled.nav`
  display: flex;
  flex-direction: column;
  padding: 4px 0;
`;

export const ExplorerItem = styled.button<{
  $active?: boolean;
  $cursor?: boolean;
  $compact?: boolean;
}>`
  display: grid;
  grid-template-columns: ${(p) => (p.$compact ? '0 18px minmax(0, 1fr)' : '22px 18px minmax(0, 1fr)')};
  align-items: center;
  gap: 4px;
  padding: 1px 8px;
  text-align: left;
  color: ${(p) => (p.$active ? 'var(--accent)' : p.$cursor ? 'var(--fg)' : 'var(--fg-dim)')};
  background: ${(p) =>
    p.$active ? 'var(--accent-bg)' : p.$cursor ? 'var(--bg-raise)' : 'transparent'};

  &:hover {
    background: ${(p) => (p.$active ? 'var(--accent-bg)' : 'var(--bg-raise)')};
    color: ${(p) => (p.$active ? 'var(--accent)' : 'var(--fg)')};
  }
`;

const Num = styled.span`
  color: var(--fg-faint);
  text-align: right;
  padding-right: 4px;
`;

export const ExplorerLabel = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export interface ExplorerEntry {
  id: string;
  label: ReactNode;
  icon?: IconName | (string & {});
}

export function Explorer({
  items,
  activeId,
  cursorId,
  onSelect,
}: {
  items: ExplorerEntry[];
  activeId?: string;
  cursorId?: string;
  onSelect: (id: string) => void;
}) {
  const listRef = useRef<HTMLElement>(null);

  // в горизонтальной (мобильной) полосе держим активный пункт в поле зрения
  useEffect(() => {
    const list = listRef.current;
    const active = list?.querySelector<HTMLElement>('[aria-current="page"]');
    if (!list || !active || list.scrollWidth <= list.clientWidth) return;
    const left = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
    list.scrollTo({ left, behavior: 'smooth' });
  }, [activeId]);

  return (
    <ExplorerList ref={listRef}>
      {items.map((item, i) => (
        <ExplorerItem
          key={item.id}
          type="button"
          aria-current={item.id === activeId ? 'page' : undefined}
          $active={item.id === activeId}
          $cursor={item.id === cursorId}
          onClick={() => onSelect(item.id)}
        >
          <Num>{i + 1}</Num>
          <span>{item.icon ? <Icon name={item.icon} /> : null}</span>
          <ExplorerLabel>{item.label}</ExplorerLabel>
        </ExplorerItem>
      ))}
    </ExplorerList>
  );
}
