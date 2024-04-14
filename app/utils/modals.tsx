import React, { FunctionComponent, ReactElement, ReactNode, useEffect, useState } from 'react';
import { nanoid } from 'nanoid/non-secure';
import { modals } from '@mantine/modals';
import { Button, Modal, ModalProps, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';

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
        opened: opened,
        setOpened: (opened: boolean) => {
            setOpened(opened);
            openedRef.current = opened;
        },
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

export type ModalChildrenProps = {
    openedModal?: boolean,
    modalId?: string,
    closeModal?: () => void,
    openModal?: () => void,
};

export function ModalButton({
                                contents,
                                children,
                                modalProps,
                            }: {
    contents: ReactNode,
    children: ReactNode,
    modalProps?: Omit<ModalProps, 'opened' | 'onClose' | 'children'>,
}) {
    const [modalId] = useState(nanoid(16));
    const { t } = useTranslation();

    const handleClose = () => {
        modals.close(modalId);
    };

    const handleOpen = () => {
        modals.open({
            modalId: modalId,
            onClose: handleClose,
            children: addPropsToComponent(contents, {
                openedModal: true,
                modalId: modalId,
                closeModal: handleClose,
                openModal: handleOpen,
            }),
            ...modalProps,
            title: t(typeof modalProps?.title === 'string' ? modalProps.title : 'common.title'),
        });
    };

    return <>
        {addClickToComponent(children, handleOpen)}
    </>;
}

export function createModalTemplate<T>({
                                           contents,
                                           modalProps,
                                       }: {
    contents: FunctionComponent<T>,
    modalProps?: Omit<ModalProps, 'opened' | 'onClose' | 'children'>,
}) {
    const Contents = contents;

    return (props: {
        children: ReactNode
    } & T) => {
        return <ModalButton contents={<Contents {...props} />} modalProps={modalProps}>
            {props.children}
        </ModalButton>;
    };
}
