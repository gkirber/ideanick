import { sentryVitePlugin } from '@sentry/vite-plugin';
import legacy from '@vitejs/plugin-legacy';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { parsePublicEnv } from './src/lib/parsePublicEnv';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var publicEnv = parsePublicEnv(env);
    if (env.HOST_ENV !== 'local' && env.SENTRY_AUTH_TOKEN) {
        if (!env.SOURCE_VERSION) {
            throw new Error('SOURCE_VERSION is not defined');
        }
    }
    return {
        plugins: [
            react(),
            svgr(),
            legacy({
                targets: ['> 0.01%'],
            }),
            env.HOST_ENV !== 'local'
                ? undefined
                : visualizer({
                    filename: './dist/bundle-stats.html',
                    gzipSize: true,
                    brotliSize: true,
                }),
            !env.SENTRY_AUTH_TOKEN
                ? undefined
                : sentryVitePlugin({
                    org: 'gkdevclb',
                    project: 'webapp',
                    authToken: env.SENTRY_AUTH_TOKEN,
                    release: { name: env.SOURCE_VERSION },
                }),
        ],
        css: {
            postcss: {
                plugins: [autoprefixer({})],
            },
        },
        build: {
            sourcemap: true,
            chunkSizeWarningLimit: 900,
        },
        server: {
            port: +env.PORT,
        },
        preview: {
            port: +env.PORT,
        },
        define: {
            'process.env': publicEnv,
        },
    };
});
