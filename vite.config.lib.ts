import { resolve } from 'node:path';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig(() => {
  return {
    root: resolve(__dirname, 'src'),
    plugins: [
      vue(),
      dts({ insertTypesEntry: true }),
    ],
    build: {
      minify: true,
      reportCompressedSize: true,
      outDir: resolve(__dirname, 'lib'),
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'virtual-list',
        formats: ['es', 'cjs'],
        fileName: format => `virtual-list.${format}.js`,
      },
      rollupOptions: {
        external: ['vue'],
        output: {
          globals: {
            vue: 'Vue',
          },
        },
      },
    },
  };
});
