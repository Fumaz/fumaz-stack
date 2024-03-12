import { vitePlugin as remix } from '@remix-run/dev';
import { installGlobals } from '@remix-run/node';
import { defineConfig } from 'vite';
import { flatRoutes } from 'remix-flat-routes';
import tsconfigPaths from 'vite-tsconfig-paths';
import envOnly from 'vite-env-only';

installGlobals();

export default defineConfig({
    plugins: [
        envOnly(),
        remix({
            routes: async (defineRoutes) => {
                return flatRoutes('routes', defineRoutes);
            },
        }),
        tsconfigPaths(),
    ],
    resolve: {
        alias: {
            '.prisma/client/index-browser': './node_modules/.prisma/client/index-browser.js',
        },
    },
    ssr: {
        noExternal: ['@tabler/icons-react'],
    },
});
