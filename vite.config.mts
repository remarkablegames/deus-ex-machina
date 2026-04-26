import { defineConfig } from 'vite';
import { createHtmlPlugin } from 'vite-plugin-html';

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'phaser',
              test: /node_modules\/(phaser|phaser-jsx)/,
            },
            {
              name: 'wavedash',
              test: /node_modules\/@wvdsh\/sdk-js/,
            },
          ],
        },
      },
    },
  },

  plugins: [createHtmlPlugin()],
});
