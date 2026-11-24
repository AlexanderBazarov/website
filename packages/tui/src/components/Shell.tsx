import styled from 'styled-components';
import { ExplorerItem, ExplorerList } from './Explorer';
import { Panel, PanelBody } from './Panel';

export const Window = styled.section<{ $active?: boolean }>`
  height: 100%;
  min-width: 0;
  min-height: 0;
  display: grid;
  grid-template-rows: auto minmax(0, 1fr) auto auto;
  grid-template-columns: minmax(0, 1fr);
  overflow: hidden;
  background: var(--bg);
  container: window / inline-size;
  border: 1px solid ${(p) => (p.$active ? 'var(--border-strong)' : 'var(--border-soft)')};

  > * {
    min-width: 0;
  }
`;

export const Sidebar = styled(Panel)`
  display: flex;
  flex-direction: column;
  min-height: 0;

  > ${PanelBody} {
    display: flex;
    flex-direction: column;
  }
`;

export const SidebarFoot = styled.div`
  margin-top: auto;
  padding: 10px 12px;
  border-top: 1px solid var(--border-soft);
`;

export const PaneBody = styled.div`
  min-height: 0;
  padding: 8px;
  display: grid;
  grid-template-columns: var(--sidebar, 200px) minmax(0, 1fr);
  gap: 8px;

  @container (max-width: 1000px) {
    --sidebar: 150px;
  }

  /* узко (телефон): explorer превращается в горизонтальную полосу вкладок над вьюхой */
  @container (max-width: 560px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(0, 1fr);
    padding: 6px;
    gap: 6px;

    > ${Sidebar} {
      flex: none;

      > header,
      ${SidebarFoot} {
        display: none;
      }

      > ${PanelBody} {
        overflow: hidden;
      }
    }

    ${ExplorerList} {
      position: relative;
      flex-direction: row;
      gap: 2px;
      padding: 0;
      overflow-x: auto;
      scrollbar-width: none;
      overscroll-behavior-x: contain;
      scroll-snap-type: x proximity;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    ${ExplorerItem} {
      flex: none;
      grid-template-columns: 18px auto;
      padding: 8px 12px;
      scroll-snap-align: start;

      > :first-child {
        display: none;
      }
    }
  }
`;

export const PaneMain = styled.main`
  min-width: 0;
  min-height: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  overflow: auto;
`;

export const ViewBody = styled.div<{ $flush?: boolean }>`
  min-height: 0;
  overflow: auto;
  padding: ${(p) => (p.$flush ? '0' : '10px 12px')};
`;
