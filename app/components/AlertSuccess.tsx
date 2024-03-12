import {Alert} from '@mantine/core';
import {IconAlertCircle} from '@tabler/icons-react';
import {useTranslation} from "react-i18next";

export function AlertSuccess({
                                 title,
                                 description,
                                 withHeader = true,
                             }: {
    title?: string;
    description: string | null | undefined;
    withHeader?: boolean;
}) {
    const {t} = useTranslation();

    if (!title) {
        title = t('alert.success');
    }

    if (!description) {
        return null;
    }

    return <Alert variant={'filled'} color={'green'} title={withHeader ? title : undefined}
                  style={{whiteSpace: 'pre-wrap'}} icon={withHeader ? <IconAlertCircle/> : undefined}
                  ta={title ? 'left' : 'center'}>
        {t(description)}
    </Alert>;
}
