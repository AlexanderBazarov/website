import styled, { css } from 'styled-components';
import { Link } from '@mystyte/tui';

/** колонки; на узком окне складываются в одну. $template — свой grid-template-columns */
export const Cols = styled.div<{ $template?: string; $gap?: number }>`
  display: grid;
  gap: ${(p) => p.$gap ?? 8}px;
  align-items: start;
  grid-template-columns: ${(p) => p.$template ?? 'repeat(2, minmax(0, 1fr))'};

  @container (max-width: 620px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
`;

export const Pad = styled.div`
  padding: 10px 12px;
`;

/* ---------- панель ----------
 *
 * <Panel>
 *   <PanelHead>
 *     <Icon name="folder" /> <PanelIndex>01 /</PanelIndex> заголовок
 *     <PanelMore to="projects">→ все</PanelMore>
 *   </PanelHead>
 *   …содержимое…
 * </Panel>
 *
 * $fill — растянуть панель на всю высоту окна.
 */

export const Panel = styled.section<{ $fill?: boolean }>`
  min-width: 0;
  border: 1px solid var(--border);
  background: var(--bg-panel);

  ${(p) =>
    p.$fill &&
    css`
      flex: 1 0 auto;
      display: flex;
      flex-direction: column;

      > :last-child {
        flex: 1 0 auto;
      }
    `}
`;

export const PanelHead = styled.header`
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 26px;
  padding: 4px 10px;
  color: var(--accent);
  background: var(--bg-inset);
  border-bottom: 1px solid var(--border);
  white-space: nowrap;
`;

export const PanelIndex = styled.span`
  color: var(--fg-dim);
`;

export const PanelMore = styled(Link)`
  margin-left: auto;
  color: var(--fg-dim);

  &:hover {
    color: var(--accent);
    text-decoration: none;
  }
`;
