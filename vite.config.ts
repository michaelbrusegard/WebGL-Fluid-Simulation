import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

const config = defineConfig({
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'WebGLFluidEnhanced',
      fileName: (format) => `index.${format}.js`,
    },
  },
  resolve: {
    alias: {
      'webgl-fluid-enhanced': './src/index.ts',
    },
  },

  plugins: [dts({ rollupTypes: true })],
});

export default config;
