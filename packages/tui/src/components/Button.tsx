import type { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Icon, type IconName } from './Icon';

export type ButtonVariant = 'default' | 'primary' | 'ghost';

const Bracket = styled.span`
  color: var(--fg-faint);
`;

const base = css<{ $variant: ButtonVariant }>`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 3px 14px;
  border: 1px solid var(--border-strong);
  color: var(--fg);
  background: transparent;
  white-space: nowrap;

  &:hover {
    border-color: var(--accent);
    color: var(--accent);
    background: var(--bg-raise);
    text-decoration: none;
  }

  &:hover ${Bracket} {
    color: inherit;
  }

  ${(p) =>
    p.$variant === 'primary' &&
    css`
      border-color: var(--accent);
      color: var(--accent);

      &:hover {
        background: var(--accent-bg);
        color: #fff;
      }
    `}

  ${(p) =>
    p.$variant === 'ghost' &&
    css`
      border-color: transparent;
      color: var(--fg-dim);
      padding-left: 0;

      &:hover {
        color: var(--accent);
        background: none;
      }
    `}
`;

const ButtonEl = styled.button<{ $variant: ButtonVariant }>`
  ${base}
`;

const LinkEl = styled.a<{ $variant: ButtonVariant }>`
  ${base}
`;

const External = styled.span`
  &::after {
    content: ' ↗';
    color: var(--fg-faint);
  }
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
`;

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  external?: boolean;
  variant?: ButtonVariant;
  icon?: IconName | (string & {});
  title?: string;
}

export function Button({
  children,
  onClick,
  href,
  external,
  variant = 'default',
  icon,
  title,
}: ButtonProps) {
  const content = (
    <>
      <Bracket>[</Bracket>
      {icon && <Icon name={icon} />}
      {external ? <External>{children}</External> : <span>{children}</span>}
      <Bracket>]</Bracket>
    </>
  );

  if (href) {
    return (
      <LinkEl
        $variant={variant}
        href={href}
        title={title}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {content}
      </LinkEl>
    );
  }

  return (
    <ButtonEl type="button" $variant={variant} onClick={onClick} title={title}>
      {content}
    </ButtonEl>
  );
}
