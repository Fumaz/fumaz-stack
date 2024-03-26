import { useForm } from '@mantine/form';
import { LoginActionData, loginActionRoute, LoginSchema } from '~/routes/api/authentication/login/route';
import { useCustomFetcher } from '~/utils/fetcher';
import { Anchor, Button, Divider, PasswordInput, SimpleGrid, Stack, Text, TextInput, Title } from '@mantine/core';
import { AlertError } from '~/components/AlertError';
import { useTranslation } from 'react-i18next';
import { IconBrandFacebookFilled, IconBrandGoogleFilled } from '@tabler/icons-react';

export default function Route() {
    const { t } = useTranslation();
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
        } satisfies LoginSchema,
        validate: {
            email: (value) => {
                if (!value) {
                    return t('requiredField');
                }
            },
            password: (value) => {
                if (!value) {
                    return t('requiredField');
                }
            },
        },
    });
    const fetcher = useCustomFetcher<LoginActionData, LoginSchema>({
        action: loginActionRoute(),
    });

    function submit() {
        fetcher.submit(form.values);
    }

    return (
        <form onSubmit={form.onSubmit(submit)}>
            <Stack>
                <Stack gap={0}>
                    <Title order={1}>{t('login.title')}</Title>
                    <Text size={'sm'} c={'dimmed'}>{t('login.subtitle')}</Text>
                </Stack>

                <SimpleGrid cols={2}>
                    <Button fullWidth color={'blue'}
                            leftSection={<IconBrandFacebookFilled stroke={0.01} />}>Facebook</Button>
                    <Button fullWidth color={'red'} leftSection={<IconBrandGoogleFilled stroke={0.1} />}>Google</Button>
                </SimpleGrid>

                <Divider orientation={'horizontal'} label={t('login.withEmail')} />

                <TextInput label={t('login.fields.email')} {...form.getInputProps('email')} />
                <PasswordInput label={t('login.fields.password')} {...form.getInputProps('password')} />

                <AlertError description={fetcher.error} />

                <Button type={'submit'} loading={fetcher.loading}>{t('login.buttons.login')}</Button>

                <Text size={'sm'} ta={'center'}>
                    {t('login.links.dontHaveAccount')}{' '}
                    <Anchor href={'/register'}>{t('login.links.register')}</Anchor>
                </Text>
            </Stack>
        </form>
    );
}
