'use client';

import * as Sentry from '@sentry/nextjs';
import { useEffect } from 'react';

export default function GlobalError({
                                        error,
                                        reset, // CORRECCIÓN: Ahora se utiliza la función 'reset'.
                                    }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        Sentry.captureException(error);
    }, [error]);

    return (
        <html>
        <body>
        <h2>Algo salió muy mal.</h2>
        <button
            onClick={
                // CORRECCIÓN: Este botón permite al usuario intentar recuperar la aplicación.
                () => reset()
            }
        >
            Intentar de nuevo
        </button>
        </body>
        </html>
    );
}
