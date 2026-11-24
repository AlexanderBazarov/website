import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const src = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@mystyte/tui', replacement: src('../../packages/tui/src/index.ts') },
      { find: '@mystyte/core/fields', replacement: src('../../packages/core/src/fields.tsx') },
      { find: '@mystyte/core', replacement: src('../../packages/core/src/index.ts') },
      { find: '@', replacement: src('./src') },
    ],
  },
  server: { port: 5173, open: false },
});
