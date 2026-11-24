import { useRef, useState, type ReactNode } from 'react';
import styled, { keyframes } from 'styled-components';

const blink = keyframes`
  0%, 49% { opacity: 1; }
  50%, 100% { opacity: 0; }
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 12px;
  border-top: 1px solid var(--border);
  background: var(--bg-inset);
  color: var(--fg-dim);
`;

const Sigil = styled.span`
  color: var(--accent);
`;

const Field = styled.span`
  display: flex;
  align-items: center;
  min-width: 0;
`;

const Input = styled.input`
  flex: 0 0 auto;
  max-width: 48ch;
  min-width: 0;
  background: none;
  border: none;
  color: var(--fg);
  font: inherit;
  caret-color: transparent;

  &:focus {
    outline: none;
  }
`;

const Caret = styled.span`
  display: inline-block;
  width: 0.6em;
  height: 1.05em;
  background: var(--accent);
  vertical-align: -2px;
  animation: ${blink} 1.1s steps(1) infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const Ghost = styled.span`
  color: var(--fg-faint);
`;

const Spacer = styled.span`
  flex: 1;
`;

const Hint = styled.span`
  color: var(--fg-faint);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @container (max-width: 680px) {
    display: none;
  }
`;

export function CommandLine({
  id,
  sigil = '>',
  placeholder,
  hint,
  onSubmit,
  history = [],
}: {
  id?: string;
  sigil?: ReactNode;
  placeholder?: string;
  hint?: ReactNode;
  onSubmit: (input: string) => void;
  history?: string[];
}) {
  const [value, setValue] = useState('');
  const [cursorHistory, setCursorHistory] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Form
      onSubmit={(event) => {
        event.preventDefault();
        const trimmed = value.trim();
        if (!trimmed) return;
        onSubmit(trimmed);
        setValue('');
        setCursorHistory(-1);
        inputRef.current?.blur();
      }}
      onClick={() => inputRef.current?.focus()}
    >
      <Sigil>{sigil}</Sigil>
      <Field>
        <Input
          ref={inputRef}
          id={id}
          style={{ width: `${Math.max(value.length, 1)}ch` }}
          value={value}
          spellCheck={false}
          autoComplete="off"
          aria-label="командная строка"
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'ArrowUp' && history.length) {
              event.preventDefault();
              const next = Math.min(cursorHistory + 1, history.length - 1);
              setCursorHistory(next);
              setValue(history[history.length - 1 - next] ?? '');
            }
            if (event.key === 'ArrowDown' && history.length) {
              event.preventDefault();
              const next = Math.max(cursorHistory - 1, -1);
              setCursorHistory(next);
              setValue(next < 0 ? '' : (history[history.length - 1 - next] ?? ''));
            }
            if (event.key === 'Escape') {
              setValue('');
              inputRef.current?.blur();
            }
          }}
        />

        <Caret aria-hidden="true" />
        {!value && placeholder && <Ghost>{placeholder}</Ghost>}
      </Field>
      <Spacer />

      {hint && <Hint>{hint}</Hint>}
    </Form>
  );
}
