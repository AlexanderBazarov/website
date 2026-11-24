import { Children, type ReactNode } from 'react';
import styled from 'styled-components';

const Wrap = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
`;

const Nums = styled.div<{ $clip?: boolean }>`
  display: flex;
  flex-direction: column;
  padding: 10px 8px 10px 10px;
  color: var(--fg-faint);
  text-align: right;
  border-right: 1px solid var(--border-soft);
  user-select: none;

  /* clip: номера не влияют на высоту блока, лишние обрезаются */
  ${(p) =>
    p.$clip &&
    `
    height: 0;
    min-height: 100%;
    overflow: hidden;
  `}
`;

const Content = styled.div`
  padding: 10px 14px;
  min-width: 0;
  overflow: auto;
`;

export function Gutter({
  lines,
  from = 1,
  clip,
  children,
}: {
  lines?: number;
  from?: number;
  /** номера не задают высоту: сколько влезло по контенту, столько и видно */
  clip?: boolean;
  children: ReactNode;
}) {
  const count = lines ?? Math.max(Children.count(children), 1);
  return (
    <Wrap>
      <Nums aria-hidden="true" $clip={clip}>
        {Array.from({ length: count }, (_, i) => (
          <span key={i}>{from + i}</span>
        ))}
      </Nums>
      <Content>{children}</Content>
    </Wrap>
  );
}
