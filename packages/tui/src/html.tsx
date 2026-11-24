import type { MouseEvent, ReactNode } from 'react';
import styled from 'styled-components';
import { renderFields, useRouter, useT, type Field, type I18nText } from '@mystyte/core';
import { Stack } from './components/Panel';

/** Корень TSX-вьюхи: колонка на всю высоту окна. */
export const View = styled.article<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  flex: 1 0 auto;
  gap: ${(p) => p.$gap ?? 10}px;
  min-width: 0;
`;

/** Перевод: `<T ru="…" en="…" />` или `<T>{i18nText}</T>`. */
export function T({ ru, en, children }: { ru?: string; en?: string; children?: I18nText }) {
  const t = useT();
  return <>{t(children ?? { ru, en })}</>;
}

/**
 * Обычная ссылка `<a>`.
 * `to="projects"` — открыть путь сайта,
 * `href="https://…"` — внешняя ссылка, откроется в новой вкладке.
 */
export function Link({
  to,
  href,
  className,
  title,
  children,
}: {
  to?: string;
  href?: string;
  className?: string;
  title?: string;
  children: ReactNode;
}) {
  const { open } = useRouter();

  if (href) {
    const external = /^(https?:|mailto:|tel:)/.test(href);
    return (
      <a
        href={href}
        className={className}
        title={title}
        {...(external ? { target: '_blank', rel: 'noreferrer noopener' } : {})}
      >
        {children}
      </a>
    );
  }

  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (to) open(to);
  };

  return (
    <a href={to ? `#${to}` : undefined} className={className} title={title} onClick={onClick}>
      {children}
    </a>
  );
}

/** Контент из Field[] (тексты постов, рецептов, README) внутри TSX-вьюхи. */
export function Fields({ items }: { items: readonly Field[] | undefined }) {
  return <Stack>{renderFields(items)}</Stack>;
}
