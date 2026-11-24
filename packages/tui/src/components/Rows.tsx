import type { ReactNode } from 'react';
import styled from 'styled-components';
import { Icon, type IconName } from './Icon';

const Title = styled.span`
  color: var(--accent);
  white-space: nowrap;
`;

const Arrow = styled.span`
  color: var(--fg-faint);
`;

const RowEl = styled.button`
  display: grid;
  grid-template-columns: 24px auto minmax(0, 1fr) auto auto;
  align-items: center;
  gap: 10px;
  padding: 5px 12px;
  width: 100%;
  text-align: left;
  color: var(--fg);
  border-bottom: 1px solid var(--border-soft);

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: var(--bg-raise);
    text-decoration: none;
  }

  &:hover ${Title} {
    text-decoration: underline;
  }

  &:hover ${Arrow} {
    color: var(--accent);
  }

  @container (max-width: 560px) {
    grid-template-columns: auto minmax(0, 1fr) auto auto;
    padding: 9px 12px;

    > :first-child {
      display: none;
    }
  }
`;

const Num = styled.span`
  color: var(--fg-faint);
  text-align: right;
`;

const IconCell = styled.span`
  color: var(--accent-soft);
  display: flex;
`;

const Main = styled.span`
  display: flex;
  align-items: baseline;
  gap: 14px;
  min-width: 0;
`;

const Desc = styled.span`
  color: var(--fg-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Meta = styled.span`
  color: var(--fg-dim);
  white-space: nowrap;
`;

export const Rows = styled.div`
  display: flex;
  flex-direction: column;
`;

export interface RowProps {
  num?: ReactNode;
  icon?: IconName | (string & {});
  title: ReactNode;
  desc?: ReactNode;
  meta?: ReactNode;
  badge?: ReactNode;
  onClick?: () => void;
  href?: string;
  arrow?: boolean;
}

export function Row({
  num,
  icon,
  title,
  desc,
  meta,
  badge,
  onClick,
  href,
  arrow = true,
}: RowProps) {
  return (
    <RowEl
      as={href ? 'a' : 'button'}
      type={href ? undefined : 'button'}
      href={href}
      onClick={onClick}
    >
      <Num>{num}</Num>
      <IconCell>{icon ? <Icon name={icon} /> : null}</IconCell>
      <Main>
        <Title>{title}</Title>
        {desc && <Desc>{desc}</Desc>}
      </Main>
      <Meta>
        {badge}
        {meta}
      </Meta>
      <Arrow>{arrow ? '→' : null}</Arrow>
    </RowEl>
  );
}
