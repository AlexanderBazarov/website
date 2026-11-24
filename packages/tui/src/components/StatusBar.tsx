import type { ReactNode } from 'react';
import styled from 'styled-components';

export const StatusBarRoot = styled.footer`
  display: flex;
  align-items: stretch;
  overflow: hidden;
  height: 24px;
  font-size: 12px;
  border-top: 1px solid var(--border);
  background: var(--bg-panel);
`;

export const StatusMode = styled.span`
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  padding: 0 12px;
  letter-spacing: 0.08em;
  background: var(--mode-bg);
  color: var(--mode-fg);
`;

const Segment = styled.span<{ $align: 'left' | 'right'; $optional?: boolean }>`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 12px;
  min-width: 0;
  flex-shrink: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: var(--fg-dim);
  border-right: ${(p) => (p.$align === 'right' ? 'none' : '1px solid var(--border-soft)')};
  border-left: ${(p) => (p.$align === 'right' ? '1px solid var(--border-soft)' : 'none')};

  &:is(button):hover {
    color: var(--fg);
    background: var(--bg-raise);
  }

  ${(p) =>
    p.$optional &&
    `@container (max-width: 680px) {
      display: none;
    }`}
`;

export const StatusSpacer = styled.span`
  flex: 1;
`;

export function StatusBar({ mode, children }: { mode: ReactNode; children?: ReactNode }) {
  return (
    <StatusBarRoot>
      <StatusMode>{mode}</StatusMode>
      {children}
    </StatusBarRoot>
  );
}

export function StatusSegment({
  children,
  align = 'left',
  onClick,
  title,
  optional,
}: {
  children: ReactNode;
  align?: 'left' | 'right';
  onClick?: () => void;
  title?: string;
  optional?: boolean;
}) {
  return (
    <Segment
      as={onClick ? 'button' : 'span'}
      type={onClick ? 'button' : undefined}
      $align={align}
      $optional={optional}
      onClick={onClick}
      title={title}
    >
      {children}
    </Segment>
  );
}
