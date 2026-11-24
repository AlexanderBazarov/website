import { Fragment, type ReactNode } from 'react';
import styled from 'styled-components';

const Hash = styled.span`
  color: var(--accent);
  margin-right: 10px;
`;

const HeadingEl = styled.h2<{ $level: 1 | 2 | 3 }>`
  margin: 0;
  color: ${(p) => (p.$level === 3 ? 'var(--accent)' : 'var(--fg)')};
  font-weight: 700;
  letter-spacing: -0.01em;
  font-size: ${(p) =>
    p.$level === 1
      ? 'clamp(19px, 1.6cqw + 12px, 30px)'
      : p.$level === 2
        ? 'clamp(16px, 0.8cqw + 10px, 20px)'
        : '15px'};
  line-height: ${(p) => (p.$level === 1 ? 1.25 : 'inherit')};
`;

export function Heading({
  level = 2,
  hash = true,
  children,
}: {
  level?: 1 | 2 | 3;
  hash?: boolean;
  children: ReactNode;
}) {
  return (
    <HeadingEl as={`h${level}`} $level={level}>
      {hash && <Hash>#</Hash>}
      {children}
    </HeadingEl>
  );
}

export type TextTone = 'default' | 'bright' | 'faint';

const toneColor: Record<TextTone, string> = {
  default: 'var(--fg-dim)',
  bright: 'var(--fg)',
  faint: 'var(--fg-faint)',
};

const TextEl = styled.p<{ $tone: TextTone }>`
  margin: 0;
  color: ${(p) => toneColor[p.$tone]};
`;

export function Text({ tone = 'default', children }: { tone?: TextTone; children: ReactNode }) {
  return <TextEl $tone={tone}>{children}</TextEl>;
}

const KeyValueGrid = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 2px 18px;
`;

const Key = styled.span`
  color: var(--fg-faint);
`;

const Value = styled.span`
  color: var(--fg);
`;

export function KeyValue({ rows }: { rows: { key: ReactNode; value: ReactNode }[] }) {
  return (
    <KeyValueGrid>
      {rows.map((row, i) => (
        <Fragment key={i}>
          <Key>{row.key}</Key>
          <Value>{row.value}</Value>
        </Fragment>
      ))}
    </KeyValueGrid>
  );
}

export const Kbd = styled.kbd`
  border: 1px solid var(--border-strong);
  padding: 0 5px;
  color: var(--fg-dim);
`;

export const Divider = styled.hr<{ gap?: number }>`
  border: none;
  border-top: 1px solid var(--border-soft);
  margin: ${(p) => (p.gap == null ? '6px 0' : `${p.gap}px 0`)};
`;
