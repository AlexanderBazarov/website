import type { CSSProperties, ReactNode } from 'react';
import styled, { css } from 'styled-components';

export type QuoteVariant = 'rule' | 'bare' | 'card' | 'banner' | 'terminal';
export type QuoteAlign = 'left' | 'center' | 'right';
export type QuoteTone = 'default' | 'accent' | 'muted' | 'bright';
export type QuoteSize = 'sm' | 'md' | 'lg';

interface Shape {
  $variant: QuoteVariant;
  $align: QuoteAlign;
  $tone: QuoteTone;
  $size: QuoteSize;
}

export const QuoteMark = styled.span`
  color: var(--quote-mark);
`;

export const QuoteText = styled.blockquote`
  margin: 0;
  text-wrap: pretty;
`;

export const QuoteBy = styled.figcaption`
  display: flex;
  flex-wrap: wrap;
  gap: 2px 8px;
  color: var(--quote-author);

  a {
    color: inherit;
  }
`;

const Dash = styled.span`
  color: var(--quote-mark);
`;

const Source = styled.span`
  opacity: 0.75;

  &::before {
    content: '·';
    margin-right: 6px;
    color: var(--quote-mark);
  }
`;

const tones: Record<QuoteTone, ReturnType<typeof css>> = {
  default: css``,
  accent: css`
    --quote-text: var(--accent);
    --quote-mark: var(--accent-soft);
    --quote-rule: var(--accent-soft);
  `,
  muted: css`
    --quote-text: var(--fg-faint);
  `,
  bright: css`
    --quote-text: var(--fg);
  `,
};

const sizes: Record<QuoteSize, ReturnType<typeof css>> = {
  sm: css`
    font-size: 12px;
    --quote-pad: 10px;
  `,
  md: css``,
  lg: css`
    font-size: clamp(14px, 0.6cqw + 11px, 17px);
    --quote-gap: 10px;
  `,
};

const variants: Record<QuoteVariant, ReturnType<typeof css>> = {
  bare: css``,
  rule: css`
    border-left: 1px solid var(--quote-rule);
    padding-left: var(--quote-pad);
  `,
  card: css`
    border: 1px solid var(--quote-rule);
    background: var(--bg-inset);
    padding: 10px var(--quote-pad);
  `,
  banner: css`
    border-top: 1px solid var(--quote-rule);
    border-bottom: 1px solid var(--quote-rule);
    padding: 14px var(--quote-pad);
  `,
  terminal: css`
    position: relative;
    padding-left: 2.5ch;

    &::before {
      content: '>';
      position: absolute;
      left: 0;
      top: 0;
      color: var(--quote-mark);
    }
  `,
};

export const QuoteRoot = styled.figure<Shape>`
  --quote-rule: var(--border-strong);
  --quote-mark: var(--fg-faint);
  --quote-text: var(--fg-dim);
  --quote-author: var(--fg-faint);
  --quote-pad: 12px;
  --quote-gap: 6px;

  display: grid;
  gap: var(--quote-gap);
  margin: 0;
  min-width: 0;
  color: var(--quote-text);

  ${(p) => tones[p.$tone]}
  ${(p) => sizes[p.$size]}
  ${(p) => variants[p.$variant]}

  ${(p) =>
    p.$align === 'center' &&
    css`
      text-align: center;
      justify-items: center;

      ${QuoteBy} {
        justify-content: center;
      }
    `}

  ${(p) =>
    p.$align === 'right' &&
    css`
      text-align: right;
      justify-items: end;

      ${QuoteBy} {
        justify-content: flex-end;
      }

      ${
        p.$variant === 'rule' &&
        css`
          border-left: none;
          border-right: 1px solid var(--quote-rule);
          padding-left: 0;
          padding-right: var(--quote-pad);
        `
      }
    `}
`;

export interface QuoteProps {
  children: ReactNode;
  author?: ReactNode;
  source?: ReactNode;
  href?: string;
  variant?: QuoteVariant;
  align?: QuoteAlign;
  tone?: QuoteTone;
  size?: QuoteSize;
  marks?: boolean | [string, string];
  dash?: string;
  width?: number | string;
  className?: string;
  style?: CSSProperties;
}

const defaultMarks: [string, string] = ['«', '»'];

export function Quote({
  children,
  author,
  source,
  href,
  variant = 'rule',
  align = 'left',
  tone = 'default',
  size = 'md',
  marks = true,
  dash = '—',
  width,
  className,
  style,
}: QuoteProps) {
  const [open, close] = marks === true ? defaultMarks : marks === false ? ['', ''] : marks;

  return (
    <QuoteRoot
      className={className}
      $variant={variant}
      $align={align}
      $tone={tone}
      $size={size}
      style={{
        ...(width == null ? null : { maxWidth: typeof width === 'number' ? `${width}ch` : width }),
        ...style,
      }}
    >
      <QuoteText cite={href}>
        {open && <QuoteMark>{open} </QuoteMark>}
        {children}
        {close && <QuoteMark> {close}</QuoteMark>}
      </QuoteText>
      {(author || source) && (
        <QuoteBy>
          {author && (
            <span>
              {dash && <Dash>{dash} </Dash>}
              {href ? (
                <a href={href} target="_blank" rel="noreferrer noopener">
                  {author}
                </a>
              ) : (
                author
              )}
            </span>
          )}
          {source && <Source>{source}</Source>}
        </QuoteBy>
      )}
    </QuoteRoot>
  );
}
