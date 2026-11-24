import { profile } from '../content/profile';
import type { Entry } from '../content/types';
import { cached } from './cache';
import { API, TTL_MS, get } from './github';

/*
 * Рецепты лежат JSON-файлами (формат Entry) в каталоге репозитория
 * profile.recipes. Список файлов — через GitHub API (1 запрос),
 * сами файлы — через download_url (raw.githubusercontent.com, не тратит лимит API).
 * Всё кэшируется в localStorage на час.
 */

export type Recipe = Entry;

interface ApiContent {
  name: string;
  type: string;
  download_url: string | null;
}

let loaded: Recipe[] | null = null;

/** slug из JSON, иначе имя файла без .json */
function toRecipe(file: ApiContent, data: Partial<Recipe>): Recipe | null {
  if (!data || typeof data !== 'object' || !data.title || !Array.isArray(data.body)) {
    console.warn(`recipes: ${file.name} пропущен — нет title или body`);
    return null;
  }
  return { ...data, slug: data.slug ?? file.name.replace(/\.json$/i, '') } as Recipe;
}

async function loadRecipes(): Promise<Recipe[]> {
  const { repo, dir } = profile.recipes;
  const files = await get<ApiContent[]>(`${API}/repos/${profile.github}/${repo}/contents/${dir}`);

  const recipes = await Promise.all(
    files
      .filter((file) => file.type === 'file' && /\.json$/i.test(file.name) && file.download_url)
      .map(async (file) => {
        try {
          const response = await fetch(file.download_url!);
          if (!response.ok) throw new Error(String(response.status));
          return toRecipe(file, await response.json());
        } catch (error) {
          console.warn(`recipes: не удалось загрузить ${file.name}`, error);
          return null;
        }
      }),
  );

  // новые сверху; без даты — в конце
  return recipes
    .filter((recipe): recipe is Recipe => recipe !== null)
    .sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''));
}

export async function getRecipes(): Promise<Recipe[]> {
  const { repo, dir } = profile.recipes;
  const list = await cached(`gh:${profile.github}:${repo}:recipes:/${dir}`, TTL_MS, loadRecipes);
  loaded = list;
  return list;
}

/** один рецепт по slug; null — не найден */
export async function getRecipe(slug: string): Promise<Recipe | null> {
  const list = await getRecipes();
  return list.find((recipe) => recipe.slug === slug) ?? null;
}

/** рецепт из уже загруженного списка, без запроса (для заголовка окна) */
export function peekRecipe(slug: string): Recipe | undefined {
  return loaded?.find((recipe) => recipe.slug === slug);
}
