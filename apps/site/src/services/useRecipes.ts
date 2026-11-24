import { getRecipe, getRecipes, type Recipe } from './recipes';
import { useAsync, type Async } from './useGitHub';

export function useRecipes(): Async<Recipe[]> {
  return useAsync(() => getRecipes(), []);
}

/** один рецепт по slug; data = null — не найден */
export function useRecipe(slug: string): Async<Recipe | null> {
  return useAsync(() => getRecipe(slug), [slug]);
}
