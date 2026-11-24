import { tabunPosts } from './tabun';
import type { Entry } from './types';

const ownPosts: Entry[] = [
  {
    slug: 'usb-driver',
    title: { ru: 'Как я написал USB-драйвер', en: 'How I wrote a USB driver' },
    date: '2024-03-12',
    tag: '#linux',
    icon: 'file',
    desc: {
      ru: 'Разбор протокола дисплея и первые байты в устройство.',
      en: 'Reverse-engineering a display protocol and the first bytes sent.',
    },
    body: [
      {
        type: 'heading',
        text: { ru: 'Как я написал USB-драйвер', en: 'How I wrote a USB driver' },
        level: 2,
      },
      {
        type: 'badges',
        items: [
          { label: '2024-03-12', tone: 'muted' },
          { label: '#linux', tone: 'accent' },
          { label: { ru: '8 минут', en: '8 min read' }, tone: 'muted' },
        ],
      },
      {
        type: 'text',
        text: {
          ru: 'Всё началось с того, что экран на помпе показывал только температуру — и только из фирменной программы под Windows.',
          en: 'It started with a pump screen that only showed temperature — and only from the vendor app on Windows.',
        },
        tone: 'bright',
      },
      {
        type: 'steps',
        items: [
          {
            title: { ru: 'Снять дамп трафика', en: 'Capture the traffic' },
            body: {
              ru: 'Wireshark + usbmon показывают, что устройство — обычный HID с отчётами по 64 байта.',
              en: 'Wireshark plus usbmon shows the device is a plain HID with 64-byte reports.',
            },
          },
          {
            title: { ru: 'Понять формат кадра', en: 'Decode the frame format' },
            body: {
              ru: 'Первый байт — тип отчёта, дальше — цифры по сегментам. Никакого шифрования, только порядок.',
              en: 'First byte is the report type, then per-segment digits. No encryption, just ordering.',
            },
          },
          {
            title: { ru: 'Написать свой клиент', en: 'Write your own client' },
            body: {
              ru: 'На Go это 200 строк: открыть устройство, собрать кадр, слать раз в секунду.',
              en: 'In Go that is 200 lines: open the device, build a frame, send once a second.',
            },
          },
        ],
      },
      {
        type: 'code',
        lang: 'go',
        code: 'dev, err := hid.OpenFirst(vendorID, productID)\nif err != nil {\n\treturn fmt.Errorf("open device: %w", err)\n}\ndefer dev.Close()',
      },
      {
        type: 'quote',
        variant: 'terminal',
        marks: false,
        tone: 'bright',
        text: {
          ru: 'Железо перестаёт быть магией ровно в тот момент, когда ты видишь его байты.',
          en: 'Hardware stops being magic the moment you can see its bytes.',
        },
        author: 'moonlight_dev',
        source: 'usbmon',
      },
    ],
  },
  {
    slug: 'neovim',
    title: { ru: 'Мой Neovim без лишнего', en: 'My Neovim, nothing extra' },
    date: '2024-02-01',
    tag: '#neovim',
    icon: 'file',
    desc: {
      ru: 'Конфиг на 150 строк, который не надо чинить каждый месяц.',
      en: 'A 150-line config that does not need monthly repairs.',
    },
    body: [
      {
        type: 'heading',
        text: { ru: 'Мой Neovim без лишнего', en: 'My Neovim, nothing extra' },
        level: 2,
      },
      {
        type: 'badges',
        items: [
          { label: '2024-02-01', tone: 'muted' },
          { label: '#neovim', tone: 'accent' },
          { label: { ru: '5 минут', en: '5 min read' }, tone: 'muted' },
        ],
      },
      {
        type: 'text',
        text: {
          ru: 'Каждый плагин — это обещание поддерживать чужой код. Я оставил только те, без которых реально медленнее.',
          en: 'Every plugin is a promise to maintain somebody else code. I kept only the ones I would actually miss.',
        },
        tone: 'bright',
      },
      {
        type: 'checklist',
        items: [
          { label: 'lsp', note: { ru: 'встроенный', en: 'built-in' }, done: true },
          { label: 'treesitter', note: { ru: 'подсветка', en: 'highlighting' }, done: true },
          { label: 'telescope', note: { ru: 'поиск', en: 'search' }, done: true },
          { label: { ru: 'файловое дерево', en: 'file tree' }, note: 'netrw', done: false },
          { label: { ru: 'автокомплит-комбайн', en: 'completion suite' }, done: false },
        ],
      },
      {
        type: 'code',
        lang: 'lua',
        code: 'vim.opt.number = true\nvim.opt.relativenumber = true\nvim.keymap.set("n", "<leader>f", builtin.find_files)',
      },
    ],
  },
];

/** свои посты + загруженные с tabun (`npm run sync:tabun`), новые сверху */
export const posts: Entry[] = [...ownPosts, ...tabunPosts].sort((a, b) =>
  (b.date ?? '').localeCompare(a.date ?? ''),
);

export const postBySlug = (slug: string) => posts.find((post) => post.slug === slug);
