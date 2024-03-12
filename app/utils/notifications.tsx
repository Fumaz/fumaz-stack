import { NotificationData, notifications } from '@mantine/notifications';
import { IconCheck, IconExclamationMark } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';

export function useNotifications() {
    const { t } = useTranslation();

    return {
        showSuccessNotification: (message: string) => {
            notifications.show({
                title: t('notifications.success'),
                color: 'green',
                message: message,
                withBorder: true,
                icon: <IconCheck />,
            });
        },
        showFailureNotification: (message: string) => {
            notifications.show({
                title: t('notifications.error'),
                color: 'red',
                message: message,
                withBorder: true,
                icon: <IconExclamationMark />,
            });
        },
        showNotification: (data: NotificationData) => {
            notifications.show(data);
        },
    };
}
