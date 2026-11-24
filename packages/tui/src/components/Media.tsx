import { useCallback, useState, type ReactNode } from 'react';
import styled from 'styled-components';
import { Link } from '../html';
import { Stack } from './Panel';

/** кусок строки: просто текст, ссылка или жирный */
export type Inline = string | { text: string; href?: string; strong?: boolean };

/** `'\n'` внутри частей — перенос строки */
export function InlineText({ parts }: { parts: readonly Inline[] }) {
  return (
    <>
      {parts.map((part, i) => {
        if (typeof part === 'string') {
          return part.split('\n').map((line, j) => (
            <span key={`${i}-${j}`}>
              {j > 0 && <br />}
              {line}
            </span>
          ));
        }
        const text = part.strong ? <strong>{part.text}</strong> : part.text;
        return part.href ? (
          <Link key={i} href={part.href}>
            {text}
          </Link>
        ) : (
          <span key={i}>{text}</span>
        );
      })}
    </>
  );
}

const Figure = styled.figure`
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;

  img {
    display: block;
    max-width: 100%;
    height: auto;
  }

  /* рамка — только у загруженной картинки, иначе на её месте пустой прямоугольник */
  &[data-loaded] img {
    border: 1px solid var(--border-soft);
    background: var(--bg-inset);
  }

  figcaption {
    color: var(--fg-faint);
  }
`;

/** Картинка; если не загрузилась (404, CDN недоступен) — блок не показывается вовсе. */
export function Image({ src, alt, caption }: { src: string; alt?: string; caption?: ReactNode }) {
  // статус привязан к адресу: сменился src — снова «загружается»
  const [status, setStatus] = useState<{ src: string; state: 'loaded' | 'failed' }>();
  const state = status?.src === src ? status.state : 'loading';
  const setState = (next: 'loaded' | 'failed') => setStatus({ src, state: next });

  // картинка могла успеть загрузиться или упасть (кэш) до того, как React повесил обработчики
  const ref = useCallback(
    (img: HTMLImageElement | null) => {
      if (img?.complete) setStatus({ src, state: img.naturalWidth > 0 ? 'loaded' : 'failed' });
    },
    [src],
  );

  if (state === 'failed') return null;

  return (
    <Figure data-loaded={state === 'loaded' ? '' : undefined}>
      <img
        ref={ref}
        src={src}
        alt={alt ?? ''}
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onLoad={() => setState('loaded')}
        onError={() => setState('failed')}
      />
      {state === 'loaded' && caption && <figcaption>{caption}</figcaption>}
    </Figure>
  );
}

const Details = styled.details`
  border: 1px solid var(--border-soft);
  background: var(--bg-inset);

  > summary {
    cursor: pointer;
    padding: 2px 10px;
    color: var(--accent);
    list-style: none;
    user-select: none;

    &::-webkit-details-marker {
      display: none;
    }

    &::before {
      content: '▸ ';
      color: var(--fg-dim);
    }
  }

  &[open] > summary::before {
    content: '▾ ';
  }

  > div {
    padding: 8px 10px;
    border-top: 1px solid var(--border-soft);
  }
`;

export function Spoiler({ title, children }: { title: ReactNode; children: ReactNode }) {
  return (
    <Details>
      <summary>{title}</summary>
      <div>{children}</div>
    </Details>
  );
}

const ListEl = styled.ul`
  margin: 0;
  padding-left: 3ch;
  display: flex;
  flex-direction: column;
  gap: 4px;

  > li::marker {
    color: var(--accent);
  }
`;

export function List({ ordered, items }: { ordered?: boolean; items: ReactNode[] }) {
  return (
    <ListEl as={ordered ? 'ol' : 'ul'}>
      {items.map((item, i) => (
        <li key={i}>
          <Stack $gap={4}>{item}</Stack>
        </li>
      ))}
    </ListEl>
  );
}

const EmbedFrame = styled.div`
  position: relative;
  width: min(100%, 720px);
  aspect-ratio: 16 / 9;
  border: 1px solid var(--border-soft);
  background: var(--bg-inset);

  iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: 0;
  }
`;

export function Embed({ src, title }: { src: string; title?: string }) {
  return (
    <EmbedFrame>
      <iframe
        src={src}
        title={title ?? src}
        loading="lazy"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </EmbedFrame>
  );
}
