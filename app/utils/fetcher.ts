import { FetcherWithComponents, FormEncType, useFetcher } from '@remix-run/react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useNotifications } from '~/utils/notifications';
import { SerializeFrom } from '@remix-run/node';
import { HTMLFormMethod } from '@remix-run/router';

interface HookOptions<Return extends Record<string, any>> {
    encType?: string;
    method?: string;
    preventScrollReset?: boolean;
    action?: string;
    sendNotification?: boolean;
    defaultSuccessMessage?: string;
    defaultFailureMessage?: string;
    onSuccess?: (data: SerializeFrom<Return>) => void | Promise<void>;
    onFailure?: (error: string) => void | Promise<void>;
}

interface HookReturn<Return extends Record<string, any>, Submit extends Record<string, any> = Record<string, any>> {
    submit: (data: Submit, options?: HookOptions<Return>) => Promise<SerializeFrom<Return>>;
    state: 'idle' | 'submitting' | 'loading';
    loading: boolean;
    error: string | null;
    submittedData: Submit | null;
    data: SerializeFrom<Return> | null;
}

export function useCustomFetcher<Return extends Record<string, any>, Submit extends Record<string, any> = Record<string, any>>({
                                                                                                                                               encType,
                                                                                                                                               method,
                                                                                                                                               preventScrollReset,
                                                                                                                                               action,
                                                                                                                                               sendNotification,
                                                                                                                                               defaultSuccessMessage,
                                                                                                                                               defaultFailureMessage,
                                                                                                                                               onSuccess,
                                                                                                                                               onFailure,
                                                                                                                                           }: HookOptions<Return> = {
    encType: 'application/json',
    method: 'post',
    preventScrollReset: true,
    sendNotification: true,
    defaultSuccessMessage: 'Operazione completata con successo',
    defaultFailureMessage: 'Si è verificato un errore',
}): HookReturn<Return, Submit> {
    const {showSuccessNotification, showFailureNotification} = useNotifications();
    const fetcher = useFetcher<Return>();
    const [submittedData, setSubmittedData] = useState<Submit | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const callbacksRef = useRef<{
        resolve: (value: SerializeFrom<Return>) => void | Promise<void>,
        reject: (reason?: string) => void | Promise<void>
    }>();

    useEffect(() => {
        if (fetcher.state !== 'idle') {
            return;
        }

        if (!submitting) {
            return;
        }

        if (submitting) {
            setSubmitting(false);
        }

        const data = fetcher.data as any;

        if (!data) {
            return;
        }

        if ('error' in data) {
            const error = data.error ?? defaultFailureMessage;
            onFailure?.(error);

            if (sendNotification !== false) {
                showFailureNotification(error);
            }

            if (callbacksRef.current) {
                callbacksRef.current.reject(error);
            }

            setSubmittedData(null);
            return;
        }

        onSuccess?.(data);

        if (sendNotification !== false) {
            showSuccessNotification('message' in data ? data.message : defaultSuccessMessage);
        }

        if (callbacksRef.current) {
            callbacksRef.current.resolve(data);
        }

        setSubmittedData(null);
    }, [fetcher.state, callbacksRef.current]);

    const submit = useCallback(async (data: Submit, options?: HookOptions<Return>): Promise<SerializeFrom<Return>> => {
        if (fetcher.state !== 'idle') {
            throw new Error('Cannot submit while fetching');
        }

        setSubmitting(true);
        setSubmittedData(data);

        fetcher.submit(data as any, {
            encType: (options?.encType ?? encType ?? 'application/json') as FormEncType,
            method: (options?.method ?? method ?? 'POST') as HTMLFormMethod,
            preventScrollReset: options?.preventScrollReset ?? preventScrollReset,
            action: options?.action ?? action,
        });

        return new Promise<SerializeFrom<Return>>((resolve, reject) => {
            callbacksRef.current = {
                resolve,
                reject,
            };
        });
    }, [fetcher.state, callbacksRef.current, action]);
    const loading = fetcher.state !== 'idle';
    const error = fetcher.data && 'error' in (fetcher.data as any) ? (fetcher.data as any).error : null;

    return {
        submit,
        state: fetcher.state,
        loading,
        submittedData,
        error,
        data: fetcher.data ?? null,
    };
}

type ActionData = SerializeFrom<{
    action?: string,
    snowflake?: string,
    success: boolean,
}>;

export function useFetcherState<T extends ActionData>({
                                                          fetcher,
                                                          action,
                                                          onSuccess,
                                                          onFailure,
                                                          sendNotification = true,
                                                          defaultSuccessMessage,
                                                          defaultFailureMessage,
                                                      }: {
    fetcher: FetcherWithComponents<ActionData>,
    action?: string,
    onSuccess?: (message: string, data: T) => void,
    onFailure?: (error: string, data: T) => void,
    sendNotification?: boolean,
    defaultSuccessMessage?: string,
    defaultFailureMessage?: string,
}) {
    const [lastSnowflake, setLastSnowflake] = useState<string | null>(null);
    const {showSuccessNotification, showFailureNotification} = useNotifications();

    useEffect(() => {
        if (fetcher.data?.action != action || fetcher.data?.snowflake === lastSnowflake) {
            return;
        }

        setLastSnowflake(fetcher.data?.snowflake ?? null);

        if (fetcher.data?.success === true && 'message' in fetcher.data && typeof fetcher.data.message === 'string') {
            if (sendNotification) {
                showSuccessNotification(fetcher.data.message ?? defaultSuccessMessage ?? 'Operazione completata con successo.');
            }

            if (onSuccess) {
                onSuccess(fetcher.data.message ?? defaultSuccessMessage ?? 'Operazione completata con successo.', fetcher.data as T);
            }
        }

        if (fetcher.data?.success === false && 'error' in fetcher.data && typeof fetcher.data.error === 'string') {
            if (sendNotification) {
                showFailureNotification(fetcher.data.error ?? defaultFailureMessage ?? 'Si è verificato un errore.');
            }

            if (onFailure) {
                onFailure(fetcher.data.error ?? defaultFailureMessage ?? 'Si è verificato un errore.', fetcher.data as T);
            }
        }
    }, [fetcher.state]);
}
