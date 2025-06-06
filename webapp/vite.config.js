import { sentryVitePlugin } from '@sentry/vite-plugin';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import svgr from 'vite-plugin-svgr';
import { parsePublicEnv } from './src/lib/parsePublicEnv';
export default defineConfig(function (_a) {
    var mode = _a.mode;
    var env = loadEnv(mode, process.cwd(), '');
    var publicEnv = parsePublicEnv(env);
    if (env.HOST_ENV !== 'local') {
        if (!env.SENTRY_AUTH_TOKEN) {
            throw new Error('SENTRY_AUTH_TOKEN is not defined');
        }
        if (!env.SOURCE_VERSION) {
            throw new Error('SOURCE_VERSION is not defined');
        }
    }
    return {
        plugins: [
            react(),
            svgr(),
            !env.SENTRY_AUTH_TOKEN
                ? undefined
                : sentryVitePlugin({
                    org: 'gkdevclb',
                    project: 'webapp',
                    authToken: env.SENTRY_AUTH_TOKEN,
                    release: { name: env.SOURCE_VERSION },
                }),
        ],
        build: {
            sourcemap: true,
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
