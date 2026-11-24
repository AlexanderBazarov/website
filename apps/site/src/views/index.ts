import { registerViews } from '@mystyte/core';
import { aboutView } from './about';
import { blogView, postView } from './blog';
import { contactsView } from './contacts';
import { homeView } from './home';
import { projectsView } from './projects';
import { recipeView, recipesView } from './recipes';
import { repositoriesView, repositoryView } from './repositories';

registerViews([
  homeView,
  projectsView,
  repositoriesView,
  repositoryView,
  blogView,
  postView,
  recipesView,
  recipeView,
  aboutView,
  contactsView,
]);

export const defaultPath = 'home';
