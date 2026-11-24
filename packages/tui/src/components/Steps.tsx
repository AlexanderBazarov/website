import type { ReactNode } from 'react';
import styled from 'styled-components';

export interface StepItem {
  title: ReactNode;
  body?: ReactNode;
}

const List = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 10px;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Step = styled.li`
  display: grid;
  grid-template-columns: 30px minmax(0, 1fr);
  gap: 10px;
  align-items: baseline;
`;

const Num = styled.span`
  color: var(--accent);
`;

const Title = styled.div`
  color: var(--fg);
  font-weight: 700;
`;

const Body = styled.div`
  color: var(--fg-dim);
`;

export function Steps({ items, from = 1 }: { items: StepItem[]; from?: number }) {
  return (
    <List>
      {items.map((item, i) => (
        <Step key={i}>
          <Num>{from + i}.</Num>
          <span>
            <Title>{item.title}</Title>
            {item.body && <Body>{item.body}</Body>}
          </span>
        </Step>
      ))}
    </List>
  );
}
