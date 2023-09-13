import { defineConfig } from "vite"
import { svelte } from "@sveltejs/vite-plugin-svelte"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  publicDir: "./src/svelte/public",
  server: {
    port: 5173,
    fs: {
      strict: false,
    },
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  optimizeDeps: {
    // exclude: ["lodash"],
    esbuildOptions: {
      target: "es2022",
    },
  },
  build: {
    target: "es2022",
    minify: true,
    sourcemap: true,
  },
  define: {
    "process.env": {},
  },
})
