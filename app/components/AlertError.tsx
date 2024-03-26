import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export function AlertError({
                               title,
                               description,
                               withHeader = true,
                           }: {
    title?: string;
    description?: string | null | undefined | (() => string | null | undefined);
    withHeader?: boolean;
}) {
    const { t } = useTranslation();

    if (!title) {
        title = t('alert.error');
    }

    const descriptionString = typeof description === 'function' ? description() : description;

    if (!descriptionString) {
        return null;
    }

    return <Alert variant={'filled'} color={'red'} title={withHeader ? title : undefined}
                  style={{ whiteSpace: 'pre-wrap' }} icon={withHeader ? <IconAlertCircle /> : undefined}
                  ta={title ? 'left' : 'center'}>
        {t(descriptionString)}
    </Alert>;
}
