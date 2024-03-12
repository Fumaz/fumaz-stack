import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/notifications/styles.css';
import '@mantine/code-highlight/styles.css';
import '@mantine/tiptap/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/spotlight/styles.css';
import '@mantine/nprogress/styles.css';
import '@mantine/charts/styles.css';

import { Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from '@remix-run/react';
import { MantineProvider, MantineThemeOverride } from '@mantine/core';
import { json, LoaderFunctionArgs } from '@remix-run/node';
import i18next from '~/i18next.server';
import { useTranslation } from 'react-i18next';
import { useChangeLanguage } from 'remix-i18next/react';

export const TITLE = 'Fumaz Stack';
export const THEME: MantineThemeOverride = {
    primaryColor: 'pink',
    defaultRadius: 'lg',
};

export async function loader({ request }: LoaderFunctionArgs) {
    const locale = await i18next.getLocale(request);
    return json({ locale });
}

export const handle = {
    // In the handle export, we can add a i18n key with namespaces our route
    // will need to load. This key can be a single string or an array of strings.
    // TIP: In most cases, you should set this to your defaultNS from your i18n config
    // or if you did not set one, set it to the i18next default namespace "translation"
    i18n: 'common',
};

export default function App() {
    const { locale } = useLoaderData<typeof loader>();
    const { i18n } = useTranslation();

    useChangeLanguage(locale);

    return (
        <html lang={locale} dir={i18n.dir()} style={{
            height: '100%',
            width: '100%',
        }}>
        <head>
            <title>{TITLE}</title>
            <meta charSet="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <Meta />
            <Links />
        </head>
        <body style={{
            height: '100%',
            width: '100%',
        }}>
        <MantineProvider theme={THEME}>
            <Outlet />
            <ScrollRestoration />
            <Scripts />
        </MantineProvider>
        </body>
        </html>
    );
}
