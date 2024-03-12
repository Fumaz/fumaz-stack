import {useForm} from "@mantine/form";
import {LoginActionData, loginActionRoute, LoginSchema} from "~/routes/api/authentication/login/route";
import {useCustomFetcher} from "~/utils/fetcher";
import {Button, PasswordInput, Stack, TextInput} from "@mantine/core";
import {AlertError} from "~/components/AlertError";
import {useTranslation} from "react-i18next";

export default function Route() {
    const {t} = useTranslation();
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
        }
    });
    const fetcher = useCustomFetcher<LoginActionData, LoginSchema>({
        action: loginActionRoute()
    });

    function submit() {
        fetcher.submit(form.values);
    }

    return (
        <form onSubmit={form.onSubmit(submit)}>
            <Stack>
                <TextInput label={t('login.fields.email')} {...form.getInputProps('email')} />
                <PasswordInput label={t('login.fields.password')} {...form.getInputProps('password')} />

                <AlertError description={fetcher.error} />

                <Button type={'submit'} loading={fetcher.loading}>{t('login.buttons.login')}</Button>
            </Stack>
        </form>
    );
}
