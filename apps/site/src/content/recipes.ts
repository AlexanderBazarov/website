import type { Entry } from './types';

export const recipes: Entry[] = [
  {
    slug: 'pasta.md',
    title: { ru: 'Паста за 20 минут', en: 'Pasta in 20 minutes' },
    date: '2024-01-20',
    tag: '#паста',
    icon: 'utensils',
    desc: { ru: 'Томаты, чеснок, немного терпения.', en: 'Tomatoes, garlic, a bit of patience.' },
    body: [
      {
        type: 'columns',
        template: 'minmax(0, 1.5fr) minmax(0, 1fr)',
        items: [
          [
            {
              type: 'heading',
              text: { ru: 'Паста за 20 минут', en: 'Pasta in 20 minutes' },
              level: 1,
            },
            {
              type: 'badges',
              items: [
                { label: { ru: '20 мин', en: '20 min' }, tone: 'green' },
                { label: { ru: '2 порции', en: '2 servings' }, tone: 'green' },
                { label: { ru: 'просто', en: 'easy' }, tone: 'green' },
              ],
            },
          ],
          [
            {
              type: 'art',
              sprite: 'pasta',
              title: { ru: 'тарелка пасты', en: 'a plate of pasta' },
            },
            {
              type: 'quote',
              text: {
                ru: 'Вкусные идеи для более ярких дней.',
                en: 'Tasty ideas for brighter days.',
              },
              author: 'moonlight_dev',
            },
          ],
        ],
      },
      {
        type: 'panels',
        cols: 2,
        items: [
          {
            title: { ru: 'ингредиенты', en: 'ingredients' },
            icon: 'utensils',
            flush: true,
            fields: [
              {
                type: 'checklist',
                items: [
                  { label: { ru: 'паста', en: 'pasta' }, note: '200 г', done: true },
                  { label: { ru: 'томаты', en: 'tomatoes' }, note: '300 г', done: true },
                  {
                    label: { ru: 'чеснок', en: 'garlic' },
                    note: { ru: '2 зубчика', en: '2 cloves' },
                    done: true,
                  },
                  { label: { ru: 'сыр', en: 'cheese' }, note: '50 г' },
                  { label: { ru: 'оливковое масло', en: 'olive oil' } },
                  { label: { ru: 'соль, перец', en: 'salt, pepper' } },
                  { label: { ru: 'базилик (по желанию)', en: 'basil (optional)' } },
                ],
              },
            ],
          },
          {
            title: { ru: 'приготовление', en: 'method' },
            icon: 'pot',
            fields: [
              {
                type: 'steps',
                items: [
                  {
                    title: { ru: 'Отвари пасту', en: 'Boil the pasta' },
                    body: {
                      ru: 'Вскипяти воду, посоли и вари пасту до состояния al dente (8–10 минут).',
                      en: 'Bring water to a boil, salt it, cook to al dente (8–10 minutes).',
                    },
                  },
                  {
                    title: { ru: 'Приготовь соус', en: 'Make the sauce' },
                    body: {
                      ru: 'Обжарь чеснок, добавь томаты, туши 5–7 минут, приправь.',
                      en: 'Fry the garlic, add tomatoes, simmer 5–7 minutes, season.',
                    },
                  },
                  {
                    title: { ru: 'Смешай и добавь сыр', en: 'Combine and finish' },
                    body: {
                      ru: 'Соедини пасту с соусом, посыпь сыром и подавай горячей.',
                      en: 'Fold the pasta into the sauce, add cheese, serve hot.',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    slug: 'rice.md',
    title: { ru: 'Острый рис с курицей', en: 'Spicy rice with chicken' },
    date: '2024-01-05',
    tag: '#рис',
    icon: 'utensils',
    desc: { ru: 'Одна сковорода, много перца.', en: 'One pan, plenty of pepper.' },
    body: [
      {
        type: 'columns',
        template: 'minmax(0, 1.5fr) minmax(0, 1fr)',
        items: [
          [
            {
              type: 'heading',
              text: { ru: 'Острый рис с курицей', en: 'Spicy rice with chicken' },
              level: 1,
            },
            {
              type: 'badges',
              items: [
                { label: { ru: '35 мин', en: '35 min' }, tone: 'green' },
                { label: { ru: '3 порции', en: '3 servings' }, tone: 'green' },
                { label: { ru: 'средне', en: 'medium' }, tone: 'yellow' },
              ],
            },
          ],
          [
            {
              type: 'quote',
              text: {
                ru: 'Одна сковорода — меньше посуды, больше вкуса.',
                en: 'One pan — fewer dishes, more flavour.',
              },
              author: 'moonlight_dev',
            },
          ],
        ],
      },
      {
        type: 'panels',
        cols: 2,
        items: [
          {
            title: { ru: 'ингредиенты', en: 'ingredients' },
            icon: 'utensils',
            flush: true,
            fields: [
              {
                type: 'checklist',
                items: [
                  { label: { ru: 'рис', en: 'rice' }, note: '250 г', done: true },
                  {
                    label: { ru: 'куриное бедро', en: 'chicken thigh' },
                    note: '400 г',
                    done: true,
                  },
                  {
                    label: { ru: 'перец чили', en: 'chilli' },
                    note: { ru: '1 шт', en: '1 pc' },
                    done: true,
                  },
                  { label: { ru: 'лук', en: 'onion' }, note: { ru: '1 шт', en: '1 pc' } },
                  { label: { ru: 'соевый соус', en: 'soy sauce' }, note: '3 ст. л.' },
                  { label: { ru: 'яйцо', en: 'egg' }, note: { ru: '2 шт', en: '2 pcs' } },
                ],
              },
            ],
          },
          {
            title: { ru: 'приготовление', en: 'method' },
            icon: 'pot',
            fields: [
              {
                type: 'steps',
                items: [
                  {
                    title: { ru: 'Обжарь курицу', en: 'Sear the chicken' },
                    body: {
                      ru: 'Крупные куски на сильном огне до корочки, вынь из сковороды.',
                      en: 'Big pieces, high heat, until browned; take them out of the pan.',
                    },
                  },
                  {
                    title: { ru: 'Лук, чили, рис', en: 'Onion, chilli, rice' },
                    body: {
                      ru: 'Обжарь лук с чили, добавь сухой рис и прогрей минуту — так он не слипнется.',
                      en: 'Fry onion with chilli, add dry rice and toast for a minute so it stays loose.',
                    },
                  },
                  {
                    title: { ru: 'Собери блюдо', en: 'Bring it together' },
                    body: {
                      ru: 'Верни курицу, влей воду и соевый соус, готовь под крышкой 15 минут, вбей яйцо в конце.',
                      en: 'Return the chicken, add water and soy sauce, cover for 15 minutes, stir in the egg at the end.',
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

export const recipeBySlug = (slug: string) => recipes.find((recipe) => recipe.slug === slug);
