import styled, { css } from 'styled-components';
import { Link } from '@mystyte/tui';

export const Menu = styled.menu`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  margin: 0;
  padding: 0;
`;

/** кнопка-ссылка «[ текст ]»: <Btn to="projects">, <Btn $primary>, <Btn href="https://…"> */
export const Btn = styled(Link)<{ $primary?: boolean }>`
  display: inline-flex;
  gap: 1ch;
  padding: 3px 14px;
  border: 1px solid var(--border-strong);
  color: var(--fg);
  white-space: nowrap;

  &::before {
    content: '[';
    color: var(--fg-faint);
  }

  &::after {
    content: ']';
    color: var(--fg-faint);
  }

  &[target='_blank']::after {
    content: '↗ ]';
  }

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--bg-raise);
    text-decoration: none;

    &::before,
    &::after {
      color: inherit;
    }
  }

  ${(p) =>
    p.$primary &&
    css`
      border-color: var(--accent);
      color: var(--accent);

      &:hover {
        background: var(--accent-bg);
        color: #fff;
      }
    `}
`;

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

/** бейдж в рамке: <Badge $tone="green">Go</Badge> */
export const Badge = styled.mark<{ $tone?: Tone }>`
  padding: 0 8px;
  border: 1px solid currentColor;
  background: none;
  color: ${(p) => toneColor[p.$tone ?? 'default']};
  white-space: nowrap;
`;
