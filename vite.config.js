import {fileURLToPath, URL} from 'node:url'

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {VitePWA} from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        VitePWA({
            registerType: 'autoUpdate',
            devOptions: {
                enabled: true
            },
            includeAssets: ['favicon.ico', 'apple-touch-icon'],
            manifest: {
                name: 'Glouton',
                short_name: 'Glouton',
                description: 'Anti-waste application for food lovers.',
                theme_color: '#ffffff',
                icons: [
                    {
                        src: 'android/android-144x144.png',
                        sizes: '144x144',
                        type: 'image/png'
                    },
                    {
                        src: 'android/android-192x192.png',
                        sizes: '192x192',
                        type: 'image/png'
                    },
                    {
                        src: 'android/android-512x512.png',
                        sizes: '512x512',
                        type: 'image/png'
                    },
                    {
                        src: 'android/android-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'any'
                    },
                    {
                        src: 'android/android-512x512.png',
                        sizes: '512x512',
                        type: 'image/png',
                        purpose: 'maskable',
                    },
                ]
            }
        })
    ],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    }
})
