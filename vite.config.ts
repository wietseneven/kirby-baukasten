import { resolve } from 'path'
import { defineConfig, loadEnv } from 'vite'
import laravel from 'laravel-vite-plugin'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: mode === 'development' ? '/' : '/dist/',

    build: {
      outDir: resolve(__dirname, 'public/dist'),
      emptyOutDir: true,
      manifest: 'manifest.json'
    },
    plugins: [
      laravel({
        input: ['src/index.ts', 'src/styles/index.css', 'src/styles/panel.css'],
        refresh: ['site/{layouts,snippets,templates}/**/*'],
        transformOnServe: (code) =>
          code.replaceAll(
            `/assets`,
            `http://${env.KIRBY_DEV_HOSTNAME ?? '127.0.0.1'}:${env.KIRBY_DEV_PORT ?? '3000'}/assets`
          )
      })
    ],
    resolve: {
      alias: {
        '@styles': resolve(__dirname, 'src/styles/'),
        '@': resolve(__dirname, 'src/')
      }
    }
  }
})
