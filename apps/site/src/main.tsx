import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { I18nProvider, RouterProvider } from '@mystyte/core';
import { GlobalStyle } from '@mystyte/tui';
import { App } from './app/App';
import { defaultPath } from './views';

const root = document.getElementById('root');
if (!root) throw new Error('не найден #root');

createRoot(root).render(
  <StrictMode>
    <GlobalStyle />

    <I18nProvider defaultLocale="ru">
      <RouterProvider initialPath={defaultPath}>
        <App />
      </RouterProvider>
    </I18nProvider>
  </StrictMode>,
);
