import styled from 'styled-components';
import {
  registerFields,
  renderFields,
  useT,
  useRouter,
  type Field,
  type I18nText,
} from '@mystyte/core';
import { Badge, BadgeRow, type Tone } from './components/Badge';
import { Button, ButtonRow } from './components/Button';
import { Checklist } from './components/Checklist';
import { CodeBlock } from './components/CodeBlock';
import { ExplorerItem, ExplorerLabel, ExplorerList } from './components/Explorer';
import { Gutter } from './components/Gutter';
import { Embed, Image, InlineText, List, Spoiler, type Inline } from './components/Media';
import { Icon, type IconName } from './components/Icon';
import { NightScene, PixelSprite } from './components/PixelArt';
import { Columns, Panel, Stack } from './components/Panel';
import {
  Quote,
  type QuoteAlign,
  type QuoteSize,
  type QuoteTone,
  type QuoteVariant,
} from './components/Quote';
import { Row, Rows } from './components/Rows';
import { pastaSprite, terminalSprite } from './components/sprites';
import { Steps } from './components/Steps';
import { Divider, Heading, KeyValue, Text, type TextTone } from './components/Text';

export interface ActionDef {
  label: I18nText;
  to?: string;
  href?: string;
  external?: boolean;
  variant?: 'default' | 'primary' | 'ghost';
  icon?: IconName | (string & {});
}

export interface RowDef {
  title: I18nText;
  desc?: I18nText;
  meta?: I18nText;
  badge?: { label: I18nText; tone?: Tone };
  icon?: IconName | (string & {});
  to?: string;
  href?: string;
}

export interface QuoteDef {
  text: I18nText;
  author?: I18nText;
  source?: I18nText;
  href?: string;
  variant?: QuoteVariant;
  align?: QuoteAlign;
  tone?: QuoteTone;
  size?: QuoteSize;
  marks?: boolean | [string, string];
  dash?: string;
  width?: number | string;
}

export interface PanelBlock {
  title?: I18nText;
  index?: string;
  icon?: IconName | (string & {});
  flush?: boolean;
  action?: ActionDef;
  fields: Field[];
}

declare module '@mystyte/core/fields' {
  interface FieldMap {
    heading: { text: I18nText; level?: 1 | 2 | 3; hash?: boolean };
    text: { text: I18nText; tone?: 'default' | 'bright' | 'faint' };
    hero: {
      whoami?: string;
      title: I18nText;
      subtitle?: I18nText;
      text?: I18nText;
      actions?: ActionDef[];
      art?: 'night' | 'none';
      note?: QuoteDef;
    };
    actions: { items: ActionDef[] };
    badges: { items: { label: I18nText; tone?: Tone }[]; brackets?: boolean };
    code: { code: string; lang?: string; shell?: boolean };
    rows: { items: RowDef[]; numbered?: boolean };
    tree: { items: TreeItem[] };
    checklist: {
      items: { label: I18nText; note?: I18nText; done?: boolean }[];
      interactive?: boolean;
    };
    steps: { items: { title: I18nText; body?: I18nText }[] };
    quote: QuoteDef;
    kv: { rows: { key: I18nText; value: I18nText }[] };
    divider: { gap?: number };
    art: {
      sprite: 'pasta' | 'terminal' | 'night';
      maxScale?: number;
      title?: I18nText;
    };
    panels: { cols?: number; items: PanelBlock[] };
    columns: { cols?: number; gap?: number; template?: string; items: Field[][] };
    gutter: { lines?: number; from?: number; items: Field[] };
    stack: { gap?: number; items: Field[] };
    /** абзац со ссылками и переносами строк */
    rich: { parts: Inline[]; tone?: TextTone };
    image: { src: string; alt?: string; caption?: I18nText };
    spoiler: { title: I18nText; items: Field[] };
    /** пункт списка — набор полей (внутри может быть код, картинка…) */
    list: { ordered?: boolean; items: Field[][] };
    /** iframe: видео и прочие встраиваемые плееры */
    embed: { src: string; title?: string };
  }
}

const Hero = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(280px, 1.6fr) auto;
  gap: 18px;
  align-items: center;

  @container (max-width: 1080px) {
    grid-template-columns: minmax(0, 1fr) minmax(260px, 1.3fr);
    gap: 12px 14px;
  }

  @container (max-width: 760px) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

const HeroMain = styled(Stack)`
  min-width: 0;

  @container (max-width: 1080px) {
    grid-row: 1 / span 2;
  }

  @container (max-width: 760px) {
    grid-column: 1;
    grid-row: auto;
  }
`;

const HeroArt = styled.div`
  min-width: 0;

  @container (max-width: 760px) {
    grid-column: 1;
    grid-row: auto;
  }
`;

const HeroNote = styled.div`
  min-width: 0;

  @container (max-width: 1080px) {
    grid-column: 2;
    grid-row: 2;
    align-self: start;
    justify-self: start;
  }

  @container (max-width: 760px) {
    grid-column: 1;
    grid-row: auto;
    justify-self: stretch;
  }
`;

const Whoami = styled.div`
  color: var(--green);
`;

function useOpen() {
  const { open } = useRouter();
  return (path: string) => open(path);
}

export function QuoteBlock({ text, author, source, ...rest }: QuoteDef) {
  const t = useT();
  return (
    <Quote
      author={author ? t(author) : undefined}
      source={source ? t(source) : undefined}
      {...rest}
    >
      {t(text)}
    </Quote>
  );
}

function ActionButton({ action }: { action: ActionDef }) {
  const t = useT();
  const open = useOpen();
  const label = t(action.label);

  if (action.href) {
    return (
      <Button
        href={action.href}
        external={action.external ?? true}
        variant={action.variant}
        icon={action.icon}
      >
        {label}
      </Button>
    );
  }
  return (
    <Button
      variant={action.variant}
      icon={action.icon}
      onClick={() => action.to && open(action.to)}
    >
      {label}
    </Button>
  );
}

export interface TreeItem {
  label: I18nText;
  icon?: IconName | (string & {});
  /** путь сайта, который откроется по клику */
  to?: string;
  /** свой обработчик клика вместо перехода по `to` */
  onClick?: () => void;
}

export function FileTree({ items }: { items: TreeItem[] }) {
  const t = useT();
  const open = useOpen();
  return (
    <Gutter lines={items.length}>
      <ExplorerList>
        {items.map((item, i) => (
          <ExplorerItem
            key={i}
            type="button"
            $compact
            onClick={() => (item.onClick ? item.onClick() : item.to && open(item.to))}
          >
            <span />

            <span>{item.icon ? <Icon name={item.icon} /> : null}</span>
            <ExplorerLabel>{t(item.label)}</ExplorerLabel>
          </ExplorerItem>
        ))}
      </ExplorerList>
    </Gutter>
  );
}

registerFields({
  heading: ({ text, level, hash }) => {
    const t = useT();
    return (
      <Heading level={level ?? 2} hash={hash ?? true}>
        {t(text)}
      </Heading>
    );
  },

  text: ({ text, tone }) => {
    const t = useT();
    return <Text tone={tone}>{t(text)}</Text>;
  },

  hero: ({ whoami, title, subtitle, text, actions, note, art = 'night' }) => {
    const t = useT();
    return (
      <Hero>
        <HeroMain $gap={14}>
          {whoami && <Whoami>$ {whoami}</Whoami>}
          <Heading level={1} hash={false}>
            {t(title)}
          </Heading>
          {subtitle && <Text tone="bright">{t(subtitle)}</Text>}
          {text && <Text>{t(text)}</Text>}
          {actions && (
            <ButtonRow>
              {actions.map((action, i) => (
                <ActionButton key={i} action={action} />
              ))}
            </ButtonRow>
          )}
        </HeroMain>
        {art === 'night' && (
          <HeroArt>
            <NightScene />
          </HeroArt>
        )}
        {note && (
          <HeroNote>
            <QuoteBlock variant="rule" size="sm" width={20} {...note} />
          </HeroNote>
        )}
      </Hero>
    );
  },

  actions: ({ items }) => (
    <ButtonRow>
      {items.map((action, i) => (
        <ActionButton key={i} action={action} />
      ))}
    </ButtonRow>
  ),

  badges: ({ items, brackets = true }) => {
    const t = useT();
    return (
      <BadgeRow>
        {items.map((item, i) => (
          <Badge key={i} tone={item.tone} brackets={brackets}>
            {t(item.label)}
          </Badge>
        ))}
      </BadgeRow>
    );
  },

  code: ({ code, lang, shell }) => <CodeBlock code={code} lang={lang} shell={shell} />,

  rows: ({ items, numbered = true }) => {
    const t = useT();
    const open = useOpen();
    return (
      <Rows>
        {items.map((item, i) => (
          <Row
            key={i}
            num={numbered ? i + 1 : undefined}
            icon={item.icon}
            title={t(item.title)}
            desc={item.desc ? t(item.desc) : undefined}
            meta={item.meta ? t(item.meta) : undefined}
            badge={
              item.badge ? <Badge tone={item.badge.tone}>{t(item.badge.label)}</Badge> : undefined
            }
            href={item.href}
            onClick={item.to ? () => open(item.to!) : undefined}
          />
        ))}
      </Rows>
    );
  },

  tree: FileTree,

  checklist: ({ items }) => {
    const t = useT();
    return (
      <Checklist
        items={items.map((item) => ({
          label: t(item.label),
          note: item.note ? t(item.note) : undefined,
          done: item.done,
        }))}
      />
    );
  },

  steps: ({ items }) => {
    const t = useT();
    return (
      <Steps
        items={items.map((item) => ({
          title: t(item.title),
          body: item.body ? t(item.body) : undefined,
        }))}
      />
    );
  },

  quote: QuoteBlock,

  kv: ({ rows }) => {
    const t = useT();
    return <KeyValue rows={rows.map((row) => ({ key: t(row.key), value: t(row.value) }))} />;
  },

  divider: ({ gap }) => <Divider gap={gap} />,

  art: ({ sprite, maxScale, title }) => {
    const t = useT();
    if (sprite === 'night') return <NightScene maxScale={maxScale} />;

    return (
      <PixelSprite
        sprite={sprite === 'pasta' ? pastaSprite : terminalSprite}
        maxScale={maxScale}
        title={title ? t(title) : undefined}
      />
    );
  },

  panels: ({ cols = 2, items }) => {
    const t = useT();
    return (
      <Columns $cols={cols}>
        {items.map((block, i) => (
          <Panel
            key={i}
            title={block.title ? t(block.title) : undefined}
            index={block.index}
            icon={block.icon}
            flush={block.flush}
            actions={
              block.action ? (
                <ActionButton action={{ variant: 'ghost', ...block.action }} />
              ) : undefined
            }
          >
            <Stack>{renderFields(block.fields)}</Stack>
          </Panel>
        ))}
      </Columns>
    );
  },

  gutter: ({ lines, from, items }) => (
    <Gutter lines={lines ?? items.length} from={from}>
      <Stack>{renderFields(items)}</Stack>
    </Gutter>
  ),

  columns: ({ cols, gap = 8, template, items }) => (
    <Columns $cols={cols ?? items.length} $template={template}>
      {items.map((column, i) => (
        <Stack key={i} $gap={gap}>
          {renderFields(column)}
        </Stack>
      ))}
    </Columns>
  ),

  stack: ({ gap, items }) => <Stack $gap={gap}>{renderFields(items)}</Stack>,

  rich: ({ parts, tone }) => (
    <Text tone={tone}>
      <InlineText parts={parts} />
    </Text>
  ),

  image: ({ src, alt, caption }) => {
    const t = useT();
    return <Image src={src} alt={alt} caption={caption ? t(caption) : undefined} />;
  },

  spoiler: ({ title, items }) => {
    const t = useT();
    return (
      <Spoiler title={t(title)}>
        <Stack>{renderFields(items)}</Stack>
      </Spoiler>
    );
  },

  list: ({ ordered, items }) => (
    <List ordered={ordered} items={items.map((item) => renderFields(item))} />
  ),

  embed: ({ src, title }) => <Embed src={src} title={title} />,
});

export const builtinFieldsRegistered = true;
