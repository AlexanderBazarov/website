import type { Field } from '@mystyte/core';

export function notFound(what: string): Field[] {
  return [
    { type: 'heading', text: { ru: 'не найдено', en: 'not found' }, level: 2 },
    {
      type: 'text',
      text: {
        ru: `Ничего нет по адресу «${what}». Попробуйте команду cd.`,
        en: `Nothing lives at "${what}". Try the cd command.`,
      },
    },
  ];
}
