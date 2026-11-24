import { useEffect, useRef, useState, type Ref } from 'react';
import styled from 'styled-components';
import { defineView } from '@mystyte/core';
import { Gutter, Icon, NightScene, T } from '@mystyte/tui';
import { profile } from '../content/profile';
import { quotes } from '../content/quotes';
import { Btn, H1, Lead, Menu, P, Panel, PanelHead, Prompt, Quote } from '../ui';

function HomePage() {
  const quoteRef = useRef<HTMLQuoteElement>(null);
  return (
    <Panel $fill>
      <PanelHead>
        <Icon name="home" /> ~/home
      </PanelHead>

      <Gutter lines={40} clip>
        <HeroBox>
          <Hero>
            <HeroMain>
              <Prompt>$ whoami</Prompt>
              <H1 $bare>
                <T>{profile.name}</T>
              </H1>
              <Lead>
                <T>{profile.role}</T>
              </Lead>
              <Tagline>
                <T>{profile.tagline}</T>
              </Tagline>
              <Menu>
                <Btn to="projects" $primary>
                  <T ru="посмотреть проекты" en="browse projects" />
                </Btn>
                <Btn to="contacts">
                  <T ru="связаться" en="get in touch" />
                </Btn>
              </Menu>
            </HeroMain>

            <HeroArt>
              <NightScene fill fit="stretch" align="right" avoid={quoteRef} />

              <RotatingQuote noteRef={quoteRef} />
            </HeroArt>
          </Hero>
        </HeroBox>
      </Gutter>
    </Panel>
  );
}


const ROTATE_MS = 20_000;
const FADE_MS = 400;

function RotatingQuote({ noteRef }: { noteRef?: Ref<HTMLQuoteElement> }) {
  const [index, setIndex] = useState(() => Math.floor(Math.random() * quotes.length));
  const [shown, setShown] = useState(true);

  useEffect(() => {
    let fade: ReturnType<typeof setTimeout>;
    const timer = setInterval(() => {
      setShown(false);
      fade = setTimeout(() => {
        setIndex((i) => (i + 1) % quotes.length);
        setShown(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => {
      clearInterval(timer);
      clearTimeout(fade);
    };
  }, []);

  const quote = quotes[index];

  return (
    <HeroNote ref={noteRef} $small $shown={shown} lang="en" aria-live="polite">
      <p>{quote.text}</p>
      <cite>{quote.author}</cite>
    </HeroNote>
  );
}


const HeroBox = styled.div`
  height: 100%;
  container: hero / size;
`;

const Hero = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 1.6fr);
  gap: 18px;
  align-items: center;
  height: 100%;

  /* низкое окно: сцена уже, тексту больше места — кнопки не переносятся */
  @container hero (max-height: 190px) {
    grid-template-columns: minmax(0, 1.4fr) minmax(200px, 1fr);
  }

  /* узко: текст сверху, картинка забирает всю оставшуюся высоту — вкладка помещается без скролла */
  @container window (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
    grid-template-rows: auto minmax(96px, 1fr);
    align-items: start;
    gap: 14px;
  }
`;

const HeroMain = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-width: 0;

  @container window (max-width: 760px) {
    gap: 10px;
  }

  @container hero (max-height: 240px) {
    gap: 8px;
  }

  @container hero (max-height: 190px) {
    gap: 6px;

    > ${Prompt} {
      display: none;
    }
  }
`;

const Tagline = styled(P)`
  @container hero (max-height: 215px) {
    display: none;
  }
`;

/** картинка; всё внутри с position: absolute ложится поверх неё */
const HeroArt = styled.div`
  position: relative;
  align-self: stretch;
  min-width: 0;
  min-height: 120px;
  container: art / size;

  /* сцена заполняет ячейку и не раздувает её своими пропорциями */
  > svg {
    position: absolute;
    inset: 0;
  }

  @container window (max-width: 760px) {
    min-height: 0;
    height: 100%;
    overflow: hidden;

    /* цитата и сцена — одной группой у низа */
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    gap: 8px;

    > svg {
      position: static;
      order: 1;
      /* забирает всё место под цитатой; fit="stretch" дорисовывает сцену под эти пропорции */
      flex: 1 1 0;
      min-height: 0;
      height: auto !important;
    }
  }
`;

const HeroNote = styled(Quote)<{ $shown: boolean }>`
  position: absolute;
  max-width: 34ch;
  opacity: ${(p) => (p.$shown ? 1 : 0)};
  transition: opacity ${FADE_MS}ms ease;
  top: 12px;
  right: 12px;
  padding: 8px 10px;
  background: color-mix(in srgb, var(--bg-panel) 75%, transparent);
  backdrop-filter: blur(2px);

  @container window (max-width: 760px) {
    position: static;
    align-self: flex-end;
    flex: none;
  }

  /* на совсем низкой картинке цитата не влезает — прячем */
  @container art (max-height: 230px) {
    display: none;
  }
`;

export const homeView = defineView({
  id: 'home',
  route: 'home',
  title: '~/home',
  icon: 'home',
  frame: false,
  nav: { label: 'home', icon: 'home', order: 2 },
  render: () => <HomePage />,
});
