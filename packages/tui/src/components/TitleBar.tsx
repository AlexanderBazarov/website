import { Fragment, type ReactNode } from 'react';
import styled from 'styled-components';
import { Icon } from './Icon';

export const TitleBarRoot = styled.header`
  display: flex;
  align-items: stretch;
  gap: 12px;
  padding: 0 10px;
  height: 30px;
  overflow: hidden;
  border-bottom: 1px solid var(--border);
  background: var(--bg-panel);
`;

const Brand = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  flex: 0 1 auto;
  overflow: hidden;
  white-space: nowrap;
  color: var(--accent);

  > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }

  @container (max-width: 620px) {
    > span {
      display: none;
    }
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  flex: 1 1 auto;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--fg-dim);
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 0 0 auto;
  white-space: nowrap;
  color: var(--fg-faint);
`;

export const SwitchItem = styled.button<{ $active?: boolean }>`
  color: ${(p) => (p.$active ? 'var(--accent)' : 'var(--fg-faint)')};

  &:hover {
    color: var(--fg);
  }
`;

const Lang = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

export function TitleBar({
  host,
  title,
  right,
}: {
  host: ReactNode;
  title?: ReactNode;
  right?: ReactNode;
}) {
  return (
    <TitleBarRoot>
      <Brand>
        <Icon name="moon" />
        <span>{host}</span>
      </Brand>

      <Title>{title}</Title>

      <Right>{right}</Right>
    </TitleBarRoot>
  );
}

export function LangSwitch<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (next: T) => void;
}) {
  return (
    <Lang>
      {options.map((option, i) => (
        <Fragment key={option}>
          {i > 0 && <SwitchItem as="span">/</SwitchItem>}
          <SwitchItem type="button" $active={option === value} onClick={() => onChange(option)}>
            {option}
          </SwitchItem>
        </Fragment>
      ))}
    </Lang>
  );
}
