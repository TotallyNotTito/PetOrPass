import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig({
    plugins: [react()],
    // @ts-ignore
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: './test/setup.js',
    },
    build: {
        outDir: './build',
    },
    base: "./",
})
