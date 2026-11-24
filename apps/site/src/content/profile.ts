import type { I18nText } from '@mystyte/core';

export const profile = {
  host: 'moonlight@home:~',
  handle: 'moonlight_dev',
  /** логин на GitHub — отсюда грузятся репозитории */
  github: 'AlexanderBazarov',
  /** репозиторий с рецептами: JSON-файлы в каталоге dir */
  recipes: { repo: 'recipes', dir: 'recipes' },
  name: { ru: 'Александр Базаров', en: 'Alexander Bazarov' } satisfies I18nText,
  role: {
    ru: 'Разработчик · Linux · Go · Python',
    en: 'Developer · Linux · Go · Python',
  } satisfies I18nText,
  tagline: {
    ru: 'Пишу код, разбираюсь в железе, иногда готовлю.',
    en: 'I write code, poke at hardware, and sometimes cook.',
  } satisfies I18nText,
  branch: 'main',
  encoding: 'UTF-8',
  links: {
    github: 'https://github.com/AlexanderBazarov/',
    telegram: 'https://t.me/developers_box',
    email: 'mailto:avbazarov2006@mail.ru',
  },
} as const;
