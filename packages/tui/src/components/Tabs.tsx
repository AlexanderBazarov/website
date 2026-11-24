import type { ReactNode } from 'react';
import styled from 'styled-components';

export interface TabItem {
  id: string;
  label: ReactNode;
}

const Bar = styled.div`
  display: flex;
  gap: 4px;
  padding: 6px 10px 0;
  border-bottom: 1px solid var(--border);
  overflow-x: auto;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 2px 14px;
  border: 1px solid ${(p) => (p.$active ? 'var(--border-strong)' : 'var(--border-soft)')};
  border-bottom: none;
  margin-bottom: -1px;
  white-space: nowrap;
  color: ${(p) => (p.$active ? 'var(--accent)' : 'var(--fg-dim)')};
  background: ${(p) => (p.$active ? 'var(--bg-panel)' : 'var(--bg-inset)')};
  box-shadow: ${(p) =>
    p.$active ? 'inset 0 -1px 0 var(--bg-panel), 0 1px 0 var(--bg-panel)' : 'none'};

  &:hover {
    color: var(--fg);
  }
`;

export function Tabs({
  items,
  active,
  onChange,
}: {
  items: TabItem[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <Bar role="tablist">
      {items.map((item) => (
        <Tab
          key={item.id}
          type="button"
          role="tab"
          $active={item.id === active}
          aria-selected={item.id === active}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </Tab>
      ))}
    </Bar>
  );
}
