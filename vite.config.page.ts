import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => {
  return {
    base: '/virtual-list',
    root: resolve(__dirname, 'src'),
    plugins: [
      vue(),
      dts({
        insertTypesEntry: true,
        exclude: resolve(__dirname, 'src/demo'),
      }),
    ],
    build: {
      outDir: resolve(__dirname, 'dist'),
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
  };
});
