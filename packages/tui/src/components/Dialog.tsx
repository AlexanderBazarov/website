import { useEffect, type ReactNode } from 'react';
import styled from 'styled-components';

const Backdrop = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 10vh 16px 16px;
  background: rgba(5, 4, 8, 0.72);

  @media (max-width: 760px) {
    padding: 12px;
    align-items: center;
  }
`;

const Surface = styled.div`
  width: min(680px, 100%);
  max-height: min(70vh, 100dvh - 24px);
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-strong);
  background: var(--bg-panel);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
`;

export const HelpBody = styled.div`
  padding: 12px 16px;
  overflow: auto;
`;

export const HelpGrid = styled.div`
  display: grid;
  grid-template-columns: auto minmax(0, 1fr);
  gap: 3px 18px;
  align-items: baseline;
  margin-top: 10px;
`;

export function Overlay({ onClose, children }: { onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <Backdrop
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <Surface role="dialog" aria-modal="true">
        {children}
      </Surface>
    </Backdrop>
  );
}
