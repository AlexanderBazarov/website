import type { Field, I18nText } from '@mystyte/core';
import type { Tone } from '@mystyte/tui';

export interface Entry {
  slug: string;
  title: I18nText;
  desc?: I18nText;

  date?: string;
  tag?: I18nText;
  badge?: { label: I18nText; tone?: Tone };
  icon?: string;

  body: Field[];
}

export interface ProjectEntry extends Entry {
  lang: { label: string; tone?: Tone };

  repo?: string;
}
