import styled from 'styled-components';

/* ---------- список строк ----------
 *
 * <Rows>
 *   <li>
 *     <Link to="…"><i>иконка</i> <b>название</b> <span>описание</span> <small>мета</small></Link>
 *   </li>
 * </Rows>
 *
 * Номер слева и стрелка справа рисуются сами. Вместо Link можно <div> — строка без перехода.
 */
export const Rows = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: row;

  > li {
    counter-increment: row;
    border-bottom: 1px solid var(--border-soft);

    &:last-child {
      border-bottom: none;
    }
  }

  > li > * {
    display: grid;
    grid-template-columns: 2ch 16px auto minmax(0, 1fr) auto 2ch;
    align-items: center;
    gap: 10px;
    padding: 5px 12px;
    color: var(--fg);

    &::before {
      content: counter(row);
      color: var(--fg-faint);
      text-align: right;
    }
  }

  > li > a {
    &::after {
      content: '→';
      color: var(--fg-faint);
    }

    &:hover {
      background: var(--bg-raise);
      text-decoration: none;

      b {
        text-decoration: underline;
      }

      &::after {
        color: var(--accent);
      }
    }
  }

  i {
    display: flex;
    color: var(--accent-soft);
  }

  b {
    color: var(--accent);
    font-weight: inherit;
    white-space: nowrap;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--fg-dim);
  }

  small {
    display: flex;
    gap: 10px;
    font-size: inherit;
    color: var(--fg-dim);
    white-space: nowrap;
  }

  /* узко: название и мета в первой строке, описание — второй строкой под названием */
  @container (max-width: 560px) {
    > li > * {
      grid-template-columns: 16px minmax(0, 1fr) auto;
      grid-template-areas:
        'icon title meta'
        '.    desc  desc';
      gap: 2px 10px;
      padding: 9px 12px;

      &::before,
      &::after {
        display: none;
      }
    }

    i {
      grid-area: icon;
    }

    b {
      grid-area: title;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    span {
      grid-area: desc;
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;

      &:empty {
        display: none;
      }
    }

    small {
      grid-area: meta;
    }
  }
`;

/* ---------- галочки ----------
 *
 * <Checklist>
 *   <Check $done>сделано</Check>
 *   <Check>не сделано</Check>
 * </Checklist>
 */
export const Checklist = styled.ol`
  margin: 0;
  padding: 0;
  list-style: none;
  counter-reset: check;
`;

export const Check = styled.li<{ $done?: boolean }>`
  display: grid;
  grid-template-columns: 24px 34px minmax(0, 1fr);
  gap: 8px;
  padding: 2px 12px;
  color: var(--fg);
  counter-increment: check;

  &:hover {
    background: var(--bg-raise);
  }

  &::before {
    content: counter(check);
    color: var(--fg-faint);
    text-align: right;
  }

  &::after {
    content: '${(p) => (p.$done ? '[x]' : '[ ]')}';
    grid-area: 1 / 2;
    color: ${(p) => (p.$done ? 'var(--green)' : 'var(--fg-faint)')};
  }
`;
