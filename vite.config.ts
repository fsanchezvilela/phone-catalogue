import { defineConfig } from 'vitest/config';
import tsConfigPaths from 'vite-tsconfig-paths';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  server: {
    host: process.env.VITE_HOST || 'localhost', // Allow access from outside the container
    port: parseInt(process.env?.PORT || '3000') || 3000,
  },
  test: {
    globals: true, // enables global test APIs (describe, it, etc.)
    environment: 'jsdom', // or 'jsdom' for browser-like tests
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
    setupFiles: ['./vitest.setup.ts'], // Path to setup file
  },
  plugins: [
    tsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tanstackStart({ customViteReactPlugin: true, target: 'netlify' }),
    viteReact(),
    tailwindcss(),
  ],
});
