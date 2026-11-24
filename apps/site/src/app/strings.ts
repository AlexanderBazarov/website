import type { I18nText } from '@mystyte/core';

export const ui = {
  explorer: 'explorer',
  mode: 'NORMAL',
  help: { ru: 'помощь', en: 'help' },
  commandHint: {
    ru: 'cd · lang · help',
    en: 'cd · lang · help',
  },
  commandPlaceholder: { ru: 'cd projects/', en: 'cd projects/' },
  notFound: { ru: 'нет такого пути', en: 'no such path' },
  helpTitle: { ru: 'горячие клавиши', en: 'keyboard shortcuts' },
} satisfies Record<string, I18nText>;

export const shortcuts: { keys: string; label: I18nText }[] = [
  { keys: '?', label: { ru: 'эта справка', en: 'this help' } },
  { keys: 'j / k', label: { ru: 'курсор по боковой панели', en: 'move the sidebar cursor' } },
  {
    keys: 'Enter',
    label: { ru: 'открыть пункт под курсором', en: 'open the item under the cursor' },
  },
  { keys: 'Alt+L', label: { ru: 'сменить язык', en: 'switch language' } },
  { keys: ':', label: { ru: 'фокус в командную строку', en: 'focus the command line' } },
  { keys: 'Esc', label: { ru: 'закрыть окно поверх', en: 'close the overlay' } },
  { keys: 'Cmd/Ctrl+D', label: { ru: 'разделить окно вертикально', en: 'split window vertically' } },
  {
    keys: 'Cmd/Ctrl+Shift+D',
    label: { ru: 'разделить окно горизонтально', en: 'split window horizontally' },
  },
  { keys: 'Cmd/Ctrl+Q', label: { ru: 'закрыть активное окно', en: 'close the active window' } },
];
