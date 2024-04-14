import React, { ReactElement, ReactNode, useEffect } from 'react';
import { nanoid } from 'nanoid/non-secure';
import { modals } from '@mantine/modals';
import { Button, Modal, ModalProps, Stack } from '@mantine/core';

export const addPropsToComponent = (component: ReactNode, props: Record<string, any>): ReactElement => {
    if (React.isValidElement(component)) {
        return React.cloneElement(component as ReactElement, props);
    }

    throw new Error('Invalid component');
};

export const addClickToComponent = (component: ReactNode, onClick: () => void): ReactElement => {
    return addPropsToComponent(component, { onClick });
};

export function confirmModal({
                                 title = 'Sei sicuro?',
                                 message,
                                 onConfirm,
                                 onCancel = () => {
                                 },
                                 onClose = () => {
                                 },
                             }: {
    title?: string;
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    onClose?: () => void;
}) {
    modals.openConfirmModal({
        title: title,
        children: message,
        centered: true,
        labels: {
            confirm: 'Conferma',
            cancel: 'Annulla',
        },
        onConfirm() {
            onConfirm();
        },
        onCancel() {
            onCancel();
        },
        onClose() {
            onClose();
        },
    });
}

export function okModal({
                            title = 'Hey!',
                            message,
                            onClose = () => {
                            },
                        }: {
    title?: string;
    message: ReactNode;
    onClose?: () => void;
}) {
    const modalId = nanoid(8);

    modals.open({
        modalId: modalId,
        title: title,
        children: <Stack>
            {message}

            <Button fullWidth onClick={() => {
                modals.close(modalId);
                onClose();
            }}>Ok</Button>
        </Stack>,
        centered: true,
        onClose() {
            onClose();
        },
    });
}

export function useChildModal({ onOpened }: {
    onOpened?: (opened: boolean) => void
} = {
    onOpened: () => {
    },
}) {
    const [opened, setOpened] = React.useState(false);
    const openedRef = React.useRef(opened);

    const memoedComponent = React.useCallback((props: {
        button: ReactNode,
    } & Omit<ModalProps, 'opened' | 'onClose'>) => {
        const handleClose = () => {
            setOpened(false);
            openedRef.current = false;
        };
        const handleBtnClick = () => {
            setOpened(true);
            openedRef.current = true;
        };

        const ChildModal = (
            <>
                <Modal
                    {...props}
                    opened={openedRef.current}
                    onClose={handleClose}
                />

                {addClickToComponent(props.button, handleBtnClick)}
            </>
        );

        return ChildModal;
    }, []);

    useEffect(() => {
        onOpened?.(opened);
    }, [opened]);

    return {
        opened,
        setOpened,
        ChildModal: memoedComponent,
    };
}

export function ChildModal({
                               children,
                               child,
                               opened,
                               setOpened,
                               onOpened,
                           }: {
    children: ReactNode,
    child: ReactNode,
    opened: boolean,
    setOpened: (opened: boolean) => void,
    onOpened?: (opened: boolean) => void,
}) {
    React.useEffect(() => {
        onOpened?.(opened);
    }, [opened, onOpened]);

    return <>
        {addPropsToComponent(children, {
            opened,
            onClose() {
                setOpened(false);
            },
        })}

        {addClickToComponent(child, () => setOpened(true))}
    </>;
}

export function ImplicitModal(props: Omit<ModalProps, 'opened' | 'onClose'>) {
    return <Modal {...props} opened={false} onClose={() => {
    }} />;
}
