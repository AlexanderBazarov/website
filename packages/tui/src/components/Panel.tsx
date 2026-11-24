import { Fragment, type ReactNode } from 'react';
import styled from 'styled-components';
import { Icon, type IconName } from './Icon';

const PanelRoot = styled.section<{ $grow?: boolean }>`
  display: flex;
  flex-direction: column;
  min-height: 0;
  min-width: 0;
  border: 1px solid var(--border);
  background: var(--bg-panel);
  flex: ${(p) => (p.$grow ? 1 : 'initial')};
`;

const Head = styled.header`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px;
  min-height: 26px;
  color: var(--accent);
  background: var(--bg-inset);
  border-bottom: 1px solid var(--border);
`;

const Title = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Separator = styled.span`
  color: var(--fg-faint);
`;

const Index = styled.span`
  color: var(--fg-dim);
`;

const Actions = styled.span`
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  white-space: nowrap;
  color: var(--fg-dim);
`;

export const PanelBody = styled.div<{ $flush?: boolean }>`
  padding: ${(p) => (p.$flush ? '0' : '10px 12px')};
  min-height: 0;
  overflow: auto;
`;

export const Columns = styled.div<{ $cols?: number; $template?: string }>`
  display: grid;
  gap: 8px;
  align-items: start;
  grid-template-columns: ${(p) => p.$template ?? `repeat(${p.$cols ?? 2}, minmax(0, 1fr))`};

  @container (max-width: 620px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Stack = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.$gap ?? 10}px;
`;

export interface PanelProps {
  title?: ReactNode | ReactNode[];
  index?: string;
  icon?: IconName | (string & {});
  actions?: ReactNode;
  flush?: boolean;
  grow?: boolean;
  children?: ReactNode;
  className?: string;
}

export function Panel({
  title,
  index,
  icon,
  actions,
  flush,
  grow,
  children,
  className,
}: PanelProps) {
  const parts = Array.isArray(title) ? title : title != null ? [title] : [];
  const hasHead = parts.length > 0 || index || actions || icon;

  return (
    <PanelRoot className={className} $grow={grow}>
      {hasHead && (
        <Head>
          {icon && <Icon name={icon} />}

          {index && (
            <>
              <Index>{index}</Index>
              <Separator>/</Separator>
            </>
          )}
          <Title>
            {parts.map((part, i) => (
              <Fragment key={i}>
                {i > 0 && <Separator> / </Separator>}
                {part}
              </Fragment>
            ))}
          </Title>
          {actions && <Actions>{actions}</Actions>}
        </Head>
      )}
      <PanelBody $flush={flush}>{children}</PanelBody>
    </PanelRoot>
  );
}
