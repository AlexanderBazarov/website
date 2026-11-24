import { useEffect, useRef } from 'react';

export interface Binding {
  keys: string;

  description?: string;
  run: (event: KeyboardEvent) => void;

  whileTyping?: boolean;
}

interface Parsed {
  mod: boolean;
  alt: boolean;
  shift: boolean;
  key: string;
}

function parse(keys: string): Parsed {
  const parts = keys
    .toLowerCase()
    .split('+')
    .map((p) => p.trim());
  const key = parts.pop() ?? '';
  return {
    mod: parts.includes('mod') || parts.includes('ctrl') || parts.includes('cmd'),
    alt: parts.includes('alt') || parts.includes('option'),
    shift: parts.includes('shift'),
    key,
  };
}

function isTyping(target: EventTarget | null): boolean {
  const el = target as HTMLElement | null;
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
}

function matches(parsed: Parsed, event: KeyboardEvent): boolean {
  const mod = event.metaKey || event.ctrlKey;
  if (parsed.mod !== mod) return false;
  if (parsed.alt !== event.altKey) return false;
  const key = event.key === ' ' ? 'space' : event.key.toLowerCase();
  if (parsed.shift && !event.shiftKey) return false;
  return key === parsed.key || event.code.toLowerCase() === `key${parsed.key}`;
}

export function useKeymap(bindings: readonly Binding[], enabled = true): void {
  const ref = useRef(bindings);
  ref.current = bindings;

  useEffect(() => {
    if (!enabled) return;
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = isTyping(event.target);
      for (const binding of ref.current) {
        if (typing && !binding.whileTyping) continue;
        if (matches(parse(binding.keys), event)) {
          event.preventDefault();
          binding.run(event);
          return;
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [enabled]);
}
