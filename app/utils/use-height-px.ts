import { useEffect, useRef, useState } from 'react';

export function useHeightPx() {
    const firstColRef = useRef<HTMLDivElement>(null);
    const [firstColHeight, setFirstColHeight] = useState<string>('0px');

    useEffect(() => {
        function handleResize() {
            if (firstColRef.current) {
                setFirstColHeight(firstColRef.current.offsetHeight + 'px');
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [firstColRef.current]);

    return [firstColRef, firstColHeight] as const;
}
