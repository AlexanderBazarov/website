# mystyte

Персональный сайт в виде терминала: React + TypeScript, никаких UI-зависимостей.
Одно окно — шапка, боковая панель, вьюшка, командная строка и строка статуса.
Каждый экран — отдельная **вьюшка**; при запуске открывается `defaultPath`
из `apps/site/src/views/index.ts`.

```
npm install
npm run dev        # http://localhost:5173
npm run build      # сборка в apps/site/dist
npm run typecheck  # tsc по всему монорепо
```

## Структура

```
packages/core/     @mystyte/core — реестры и состояние, без разметки
  fields.tsx         реестр типов полей + renderField/renderFields
  views.ts           реестр вьюшек, маршруты, боковая навигация
  router.tsx         текущий путь (в #hash) и вкладка вьюшки: useRouter
  i18n.tsx           ru/en: I18nText, useT
  keys.ts            глобальные горячие клавиши
packages/tui/      @mystyte/tui — библиотека компонентов в стиле TUI
  components/        Panel, Explorer, TitleBar, StatusBar, CommandLine,
                     Tabs, Rows, Checklist, Steps, CodeBlock, Gutter,
                     Badge, Button, Dialog, PixelArt, Icon
  styles/            tokens.css (темы) + tui.css
  fields.tsx         рендереры встроенных типов полей
apps/site/         сам сайт
  content/           данные: профиль, проекты, репозитории, блог, рецепты
  views/             описания вьюшек (по файлу на раздел)
  app/               оболочка: App, ViewHost, командная строка, темы
```

Зависимость одна и однонаправленная: `site → tui → core`.

## Как добавить новую вкладку (вьюшку)

1. Создайте `apps/site/src/views/notes.ts`:

```ts
import { defineView } from '@mystyte/core';

export const notesView = defineView({
  id: 'notes',
  route: 'notes',                                  // адрес: #notes
  title: 'notes/',
  icon: 'file',
  nav: { label: 'notes/', icon: 'folder', order: 9 }, // пункт боковой панели
  aside: [{ type: 'quote', text: 'Записывай.', author: 'moonlight_dev' }],
  fields: [
    { type: 'heading', text: { ru: 'заметки', en: 'notes' }, level: 1 },
    { type: 'text', text: { ru: 'Короткие мысли.', en: 'Short thoughts.' } },
  ],
});
```

2. Добавьте одну строку в `apps/site/src/views/index.ts` — и всё: пункт в explorer,
   маршрут `#notes` и команда `cd notes` появятся сами.

Параметрические маршруты пишутся как `route: 'notes/:slug'`, значение приедет в
`ctx.params.slug`. Внутренние вкладки (как `README.md / files / releases`) — это поле
`tabs`; активная вкладка хранится в роутере и сбрасывается при переходе.

## Как добавить новое поле

Поле — это пара «тип в `FieldMap`» + «компонент в реестре». Встроенные живут в
`packages/tui/src/fields.tsx`; свои можно объявить где угодно:

```tsx
import { registerField, useT, type I18nText } from '@mystyte/core';

declare module '@mystyte/core/fields' {
  interface FieldMap {
    rating: { stars: number; caption?: I18nText };
  }
}

registerField('rating', ({ stars, caption }) => {
  const t = useT();
  return <div>{'★'.repeat(stars)} {caption && t(caption)}</div>;
});
```

После этого `{ type: 'rating', stars: 4 }` можно писать прямо в контенте — с
автодополнением и проверкой типов, потому что `Field` — дискриминированное
объединение по ключам `FieldMap`.

Встроенные типы: `heading`, `text`, `hero`, `actions`, `badges`, `code`, `rows`,
`tree`, `checklist`, `steps`, `quote`, `kv`, `divider`, `art`, `panels`, `columns`,
`gutter`, `stack`. Последние четыре — композиционные: `panels` и `columns` принимают
вложенные поля, поэтому разметку страницы целиком можно описать данными.

## Цитаты

Цитата — отдельный компонент `packages/tui/src/components/Quote.tsx` и одноимённое
поле с теми же опциями, так что её можно собирать из данных:

```ts
{
  type: 'quote',
  variant: 'banner',     // rule | bare | card | banner | terminal
  align: 'center',       // left | center | right
  tone: 'accent',        // default | accent | muted | bright
  size: 'lg',            // sm | md | lg
  marks: ['[', ']'],     // true — «ёлочки», false — без кавычек, пара — свои
  dash: '—',             // символ перед автором
  width: 20,             // число — в ch, строка — любое значение CSS
  text: { ru: '…', en: '…' },
  author: 'moonlight_dev',
  source: { ru: 'правило трёх шагов', en: 'the three-step rule' },
  href: 'https://…',     // подпись станет ссылкой
}
```

Цвета и отступы вынесены в CSS-переменные на самом блоке — `--quote-rule`,
`--quote-mark`, `--quote-text`, `--quote-author`, `--quote-pad`, `--quote-gap`.
Компонент принимает `className`, поэтому его можно расширять как обычный
styled-компонент, не трогая исходник:

```tsx
const HeroQuote = styled(Quote)`
  --quote-rule: var(--accent-soft);
  --quote-mark: var(--accent);
  --quote-pad: 18px;
`;
```

Внутренние части (`QuoteText`, `QuoteBy`, `QuoteMark`, `QuoteRoot`) тоже
экспортируются — их можно адресовать из своих стилей:

```tsx
const Loud = styled(Quote)`
  ${QuoteText} {
    font-size: 20px;
  }
`;
```

Живые примеры: врезка `banner` в `about.md`, `terminal` в статье про USB-драйвер,
`rule` в шапке главной.

## Пиксель-арт

Картинок в репозитории нет — арт рисуется кодом. `NightScene` генерируется процедурно
(луна, звёзды, два горных хребта, город с телебашней), `PixelSprite` рисует спрайт из
строк-символов (`packages/tui/src/components/sprites.ts`: символ = пиксель, `.` —
прозрачно). Чтобы SVG не раздувался, соседние пиксели одного цвета склеиваются в один
`<rect>`.

Размер задаёт контейнер: арт тянется на всю ширину блока, высота берётся из
соотношения сторон (`width: 100%`, `aspect-ratio`). Поэтому в широкой панели картинка
крупная, в узкой — ужимается сама. Если нужен потолок, у поля `art` и у компонентов
есть `maxScale` — максимальный размер одного «пикселя» в CSS-пикселях.

Шапка главной — это сетка из трёх колонок: текст, картинка, цитата
(`.tui-hero` / `.tui-hero__main` / `.tui-hero__art` / `.tui-hero__note`). Картинке
отдано больше половины ширины; на средней ширине цитата переезжает под картинку,
на узкой всё выстраивается в колонку.

## Окно и навигация

На экране одно окно (`AppWindow.tsx`), оно показывает текущий путь роутера.
Менеджера окон пока нет. Текущий путь хранится в адресе
(`#blog/neovim`), поэтому ссылкой можно делиться, а кнопка «назад» работает.
Вёрстка реагирует на ширину окна через CSS container queries: на узком экране боковая
панель прячется, двухколоночные блоки складываются, заголовки уменьшаются (`cqw`).

| клавиши | действие |
| --- | --- |
| `?` | справка по клавишам |
| `j` / `k`, `Enter` | курсор по боковой панели и открыть |
| `Alt+L` | сменить язык |
| `:` | фокус в командную строку |

Командная строка внизу понимает `cd`, `open`, `ls`,
`lang`, `help`, `whoami`, а также голый путь (`blog/neovim`). История — стрелками
вверх/вниз, `Enter` закрывает строку и возвращает горячие клавиши.

## Посты с tabun

```
npm run sync:tabun
```

Скрипт `scripts/tabun.ts` читает RSS автора (`/rss/personal_blog/sanya_fritz/`),
открывает каждый пост ради полного текста (в RSS он обрезан на кате), переводит HTML
в поля (`rich`, `image`, `spoiler`, `list`, `embed`, `code`, `heading`) и пишет
`apps/site/src/content/tabun.ts`. Этот файл генерируется — руками не правится;
`content/blog.ts` смешивает его со своими постами по дате. Посты, выпавшие из RSS
(в ленте ~20 последних), из файла не удаляются. Из браузера грузить нельзя:
tabun не отдаёт CORS-заголовки.

## Контент и языки

Любая строка контента — `I18nText`: либо `'строка'`, либо `{ ru: '…', en: '…' }`.
Недостающий перевод падает обратно на `ru`, поэтому переводить можно постепенно.
Переключатель `ru / en` — в правом верхнем углу.

## Стили

Вся вёрстка — на styled-components: у каждого компонента свои стилевые блоки рядом с
разметкой, отдельных CSS-файлов нет. Значения цветов и метрик живут в CSS-переменных,
которые объявляет `GlobalStyle` (`packages/tui/src/styles/global.ts`) — поэтому смена
темы не вызывает перерисовку React-дерева, а переопределить пару переменных у родителя
можно без правки компонента.

Адаптивность завязана на ширину окна: `Window` объявлен как
`container-type: inline-size`, и компоненты используют `@container` и единицы `cqw`.

## Темы

Тема одна — блок CSS-переменных в `:root` в `GlobalStyle`
(`packages/tui/src/styles/global.ts`). Цвета меняются там.
