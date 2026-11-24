import type { ProjectEntry } from './types';

export const projects: ProjectEntry[] = [
  {
    slug: 'DeepCoolGo',
    title: 'DeepCoolGo',
    desc: { ru: 'Драйвер дисплея СЖО', en: 'Display driver for a liquid cooler' },
    lang: { label: 'Go', tone: 'green' },
    repo: 'repositories/DeepCoolGo',
    icon: 'package',
    body: [],
  },
  {
    slug: 'BronyMatch',
    title: 'BronyMatch',
    desc: { ru: 'Telegram-бот знакомств', en: 'Telegram dating bot' },
    lang: { label: 'Python', tone: 'yellow' },
    repo: 'repositories/BronyMatch',
    icon: 'package',
    body: [],
  },
  {
    slug: 'dotfiles',
    title: 'dotfiles',
    desc: { ru: 'Мой рабочий Linux', en: 'My daily-driver Linux' },
    lang: { label: 'Lua', tone: 'blue' },
    repo: 'repositories/dotfiles',
    icon: 'package',
    body: [],
  },
];
