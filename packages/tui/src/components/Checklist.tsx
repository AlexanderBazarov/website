import type { ReactNode } from 'react';
import styled from 'styled-components';

export interface CheckItem {
  label: ReactNode;
  note?: ReactNode;
  done?: boolean;
}

const Box = styled.span`
  color: var(--fg-faint);
`;

const List = styled.div<{ $notes: boolean }>`
  display: flex;
  flex-direction: column;

  --check-columns: ${(p) =>
    p.$notes ? '24px 34px minmax(0, 22ch) minmax(0, 1fr)' : '24px 34px minmax(0, 1fr)'};
`;

const Item = styled.div<{ $done?: boolean }>`
  display: grid;
  grid-template-columns: var(--check-columns);
  align-items: baseline;
  gap: 8px;
  padding: 2px 12px;
  width: 100%;
  text-align: left;

  &:hover {
    background: var(--bg-raise);
  }

  ${Box} {
    color: ${(p) => (p.$done ? 'var(--green)' : 'var(--fg-faint)')};
  }
`;

const Num = styled.span`
  color: var(--fg-faint);
  text-align: right;
`;

const Label = styled.span`
  color: var(--fg);
`;

const Note = styled.span`
  color: var(--fg-dim);
  white-space: nowrap;
`;

export function Checklist({
  items,
  onToggle,
}: {
  items: CheckItem[];
  onToggle?: (index: number) => void;
}) {
  return (
    <List $notes={items.some((item) => item.note != null)}>
      {items.map((item, i) => (
        <Item
          key={i}
          as={onToggle ? 'button' : 'div'}
          type={onToggle ? 'button' : undefined}
          $done={item.done}
          onClick={onToggle ? () => onToggle(i) : undefined}
        >
          <Num>{i + 1}</Num>
          <Box>[{item.done ? 'x' : ' '}]</Box>
          <Label>{item.label}</Label>
          <Note>{item.note}</Note>
        </Item>
      ))}
    </List>
  );
}
