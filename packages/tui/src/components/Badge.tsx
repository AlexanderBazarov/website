import type { ReactNode } from 'react';
import styled from 'styled-components';

export type Tone = 'default' | 'accent' | 'green' | 'yellow' | 'blue' | 'pink' | 'muted';

const toneColor: Record<Tone, string> = {
  default: 'var(--fg-dim)',
  accent: 'var(--accent)',
  green: 'var(--green)',
  yellow: 'var(--yellow)',
  blue: 'var(--blue)',
  pink: 'var(--pink)',
  muted: 'var(--fg-faint)',
};

const BadgeEl = styled.span<{ $tone: Tone }>`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 0 8px;
  border: 1px solid currentColor;
  color: ${(p) => toneColor[p.$tone]};
  line-height: 1.5;
  white-space: nowrap;
`;

export const BadgeRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

export function Badge({
  tone = 'default',
  brackets = false,
  children,
}: {
  tone?: Tone;
  brackets?: boolean;
  children: ReactNode;
}) {
  return <BadgeEl $tone={tone}>{brackets ? <>[&nbsp;{children}&nbsp;]</> : children}</BadgeEl>;
}
