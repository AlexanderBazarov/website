import styled, { css } from 'styled-components';

/* ---------- заголовки: <H1>, <H2>, <H3>; $bare — без решётки ---------- */

interface HeadingProps {
  $bare?: boolean;
}

const heading = css<HeadingProps>`
  margin: 0;
  color: var(--fg);
  font-weight: 700;
  letter-spacing: -0.01em;

  ${(p) =>
    !p.$bare &&
    css`
      &::before {
        content: '#';
        color: var(--accent);
        margin-right: 10px;
      }
    `}
`;

export const H1 = styled.h1<HeadingProps>`
  ${heading}
  font-size: clamp(19px, 1.6cqw + 12px, 30px);
  line-height: 1.25;
`;

export const H2 = styled.h2<HeadingProps>`
  ${heading}
  font-size: clamp(16px, 0.8cqw + 10px, 20px);
`;

export const H3 = styled.h3<HeadingProps>`
  ${heading}
  font-size: 15px;
  color: var(--accent);
`;

export const P = styled.p`
  margin: 0;
  color: var(--fg-dim);
`;

export const Lead = styled(P)`
  color: var(--fg);
`;

export const Prompt = styled(P)`
  color: var(--green);
`;

export const Hr = styled.hr`
  border: none;
  border-top: 1px solid var(--border-soft);
  margin: 6px 0;
`;

/** ключ — значение: <Dl><dt>ключ</dt><dd>значение</dd></Dl> */
export const Dl = styled.dl`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 2px 18px;
  margin: 0;

  dt {
    color: var(--fg-faint);
  }

  dd {
    margin: 0;
    color: var(--fg);
  }
`;

/* ---------- цитата: <Quote><p>текст</p><cite>автор</cite></Quote> ---------- */

export const Quote = styled.blockquote<{ $small?: boolean; $banner?: boolean }>`
  display: grid;
  gap: 6px;
  margin: 0;
  padding-left: 12px;
  border-left: 1px solid var(--border-strong);
  color: var(--fg-dim);

  p {
    margin: 0;
  }

  p::before {
    content: '« ';
    color: var(--fg-faint);
  }

  p::after {
    content: ' »';
    color: var(--fg-faint);
  }

  cite {
    font-style: normal;
    color: var(--fg-faint);

    &::before {
      content: '— ';
    }
  }

  ${(p) =>
    p.$small &&
    css`
      font-size: 12px;
      padding-left: 10px;
      max-width: 20ch;
    `}

  ${(p) =>
    p.$banner &&
    css`
      gap: 10px;
      padding: 14px 12px;
      border-left: none;
      border-block: 1px solid var(--accent-soft);
      text-align: center;
      color: var(--accent);
      font-size: clamp(14px, 0.6cqw + 11px, 17px);
    `}
`;
