import {useForm} from "@mantine/form";
import {RegisterActionData, registerActionRoute, RegisterSchema} from "~/routes/api/authentication/register/route";
import {useCustomFetcher} from "~/utils/fetcher";
import {Anchor, Button, Divider, PasswordInput, Select, SimpleGrid, Stack, Text, TextInput, Title} from "@mantine/core";
import {AlertSuccess} from "~/components/AlertSuccess";
import {AlertError} from "~/components/AlertError";
import {useTranslation} from "react-i18next";
import {IconBrandFacebookFilled, IconBrandGoogleFilled} from "@tabler/icons-react";

export default function Route() {
    const {t} = useTranslation();
    const form = useForm({
        initialValues: {
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            language: 'en',
        } satisfies RegisterSchema,
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
            firstName: (value) => {
                if (!value) {
                    return t('requiredField');
                }
            },
            lastName: (value) => {
                if (!value) {
                    return t('requiredField');
                }
            },
            language: (value) => {
                if (!value) {
                    return t('requiredField');
                }
            },
        }
    });
    const fetcher = useCustomFetcher<RegisterActionData, RegisterSchema>({
        action: registerActionRoute()
    });

    function submit() {
        fetcher.submit(form.values);
    }

    return (
        <form onSubmit={form.onSubmit(submit)}>
            <Stack>
                <Stack gap={0}>
                    <Title order={1}>{t('registration.title')}</Title>
                    <Text size={'sm'} c={'dimmed'}>{t('registration.subtitle')}</Text>
                </Stack>

                <SimpleGrid cols={2}>
                    <Button fullWidth color={'blue'}
                            leftSection={<IconBrandFacebookFilled stroke={0.01}/>}>Facebook</Button>
                    <Button fullWidth color={'red'} leftSection={<IconBrandGoogleFilled stroke={0.1}/>}>Google</Button>
                </SimpleGrid>

                <Divider orientation={'horizontal'} label={t('registration.withEmail')}/>

                <SimpleGrid cols={2}>
                    <TextInput label={t('registration.fields.firstName')} {...form.getInputProps('firstName')} />
                    <TextInput label={t('registration.fields.lastName')} {...form.getInputProps('lastName')} />
                </SimpleGrid>

                <TextInput label={t('registration.fields.email')} {...form.getInputProps('email')} />
                <PasswordInput label={t('registration.fields.password')} {...form.getInputProps('password')} />

                <Select label={t('registration.fields.language')} {...form.getInputProps('language')} data={[
                    {
                        label: 'English',
                        value: 'en'
                    },
                    {
                        label: 'Italiano',
                        value: 'it'
                    }
                ]}/>

                <AlertError description={fetcher.error}/>
                <AlertSuccess description={fetcher.data?.message}/>

                <Button type={'submit'} loading={fetcher.loading}>{t('registration.buttons.register')}</Button>

                <Text size={'sm'} ta={'center'}>
                    {t('registration.links.alreadyHaveAccount')}{' '}
                    <Anchor href={'/login'}>{t('registration.links.login')}</Anchor>
                </Text>
            </Stack>
        </form>
    );
}
