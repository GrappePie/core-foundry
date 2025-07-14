'use client';
import ModuleBus from '@/core/bus/ModuleBus';
import { useEffect, useState } from 'react';

const LogisticsUI = () => {
    // CORRECCIÓN: Se usa 'unknown' para un estado de tipo desconocido pero seguro.
    const [lastEvent, setLastEvent] = useState<unknown | null>(null);

    useEffect(() => {
        const handleDataTransfer = (payload: unknown) => { // CORRECCIÓN: Tipado con unknown
            console.log('[LogisticsUI] Evento recibido!', payload);
            setLastEvent(payload);
        };

        const unsubscribe = ModuleBus.subscribe('module:data:transfer', handleDataTransfer);
        return () => unsubscribe();
    }, []);

    return (
        <div className="p-4 bg-gray-800 rounded-lg text-white">
            <h3 className="text-lg font-bold mb-4">Módulo de Logística</h3>
            <p>Esperando datos de otros módulos...</p>
            {lastEvent != null ? (
                <div className="mt-4 p-2 bg-gray-700 rounded">
                    <p className="font-bold">Último evento recibido:</p>
                    {/* CORRECCIÓN: Se usa JSON.stringify para mostrar un objeto de tipo unknown */}
                    <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(lastEvent, null, 2)}</pre>
                </div>
            ) : null}
        </div>
    );
};

export default LogisticsUI;
