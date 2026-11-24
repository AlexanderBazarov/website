import { defineView } from '@mystyte/core';
import { Fields } from '@mystyte/tui';
import { peekRecipe } from '../services/recipes';
import { useRecipe, useRecipes } from '../services/useRecipes';
import { P } from '../ui';
import { notFound } from './helpers';
import { EntryList } from './lists';

function RecipesPage() {
  const { data, error, loading } = useRecipes();

  if (loading) return <P>загрузка…</P>;
  if (error) return <P>не удалось загрузить рецепты: {error}</P>;
  if (!data?.length) return <P>рецептов нет</P>;
  return <EntryList items={data} base="recipes" desc />;
}

function RecipePage({ slug }: { slug: string }) {
  const { data, error, loading } = useRecipe(slug);

  if (loading) return <P>загрузка…</P>;
  if (error) return <P>не удалось загрузить рецепт: {error}</P>;
  return <Fields items={data?.body ?? notFound(`recipes/${slug}`)} />;
}

export const recipesView = defineView({
  id: 'recipes',
  route: 'recipes',
  title: 'recipes/',
  icon: 'utensils',
  nav: { label: 'recipes/', icon: 'folder', order: 6 },
  render: () => <RecipesPage />,
});

export const recipeView = defineView<{ slug: string }>({
  id: 'recipe',
  route: 'recipes/:slug',
  icon: 'utensils',
  title: ({ params, t }) => t(peekRecipe(params.slug)?.title) || params.slug,
  breadcrumb: ({ params }) => ['recipes', params.slug],
  render: ({ params }) => <RecipePage slug={params.slug} />,
});
