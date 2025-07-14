'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useMainStore } from '@/core/store/useMainStore';
import ModuleBus from '@/core/bus/ModuleBus';
import { ModuleDraggedPayload, ModuleConnectPayload, VisualConfig } from '@/lib/types';
import { ModulesSidebar } from '@/components/ui/ModulesSidebar';

// Cargamos Phaser solo en cliente
const PhaserCanvas = dynamic(() => import('@/components/game/PhaserCanvas'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center">
            <p className="text-white text-center text-2xl">Cargando Fábrica...</p>
        </div>
    ),
});

// Configs de tus módulos
import { inventoryModuleConfig } from '@/modules/inventory/config';
import { crmModuleConfig } from '@/modules/crm/config';
import { logisticsModuleConfig } from '@/modules/logistics/config';

const moduleRegistry = {
    inventory: inventoryModuleConfig,
    crm: crmModuleConfig,
    logistics: logisticsModuleConfig,
};

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const {
        isInitialized,
        setInitialData,
        updateModulePosition,
        addConnection,
        visualConfig
    } = useMainStore();
    const [selectedModuleUi, setSelectedModuleUi] = useState<React.ComponentType | null>(null);

    // 1) Manejo de sesión y carga inicial de datos
    useEffect(() => {
        if (status === 'loading') return;
        if (!session) {
            router.push('/login');
            return;
        }
        if (session && !isInitialized) {
            fetch('/api/tenant/me', {
                method: 'GET',
                credentials: 'include',              // ← Importante para enviar la cookie
                headers: { 'Content-Type': 'application/json' },
            })
                .then(res => {
                    if (!res.ok) throw new Error('No autorizado');
                    return res.json();
                })
                .then(data => setInitialData(data))
                .catch(err => console.error('Error al cargar datos del dashboard:', err));
        }
    }, [session, status, isInitialized, setInitialData, router]);

    // 2) Persistir cambios de configuración
    const handleConfigChange = useCallback(
        async (data: { activeModules: string[]; visualConfig: VisualConfig }) => {
            try {
                await fetch('/api/tenant/me', {
                    method: 'POST',
                    credentials: 'include',            // ← También aquí
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                });
            } catch (err) {
                console.error('[React] Error al persistir configuración:', err);
            }
        },
        []
    );

    // 3) Subscripciones al bus de módulos
    useEffect(() => {
        const handleModuleDrag = (payload: ModuleDraggedPayload) => {
            const newConfig = updateModulePosition(payload.moduleId, payload.position);
            handleConfigChange({
                activeModules: useMainStore.getState().activeModules,
                visualConfig: newConfig,
            });
        };

        const handleModuleConnect = (payload: ModuleConnectPayload) => {
            const newConfig = addConnection(payload);
            handleConfigChange({
                activeModules: useMainStore.getState().activeModules,
                visualConfig: newConfig,
            });
        };

        const handleOpenModuleUi = ({ moduleId }: { moduleId: string }) => {
            const cfg = moduleRegistry[moduleId as keyof typeof moduleRegistry];
            if (cfg) setSelectedModuleUi(() => cfg.UiComponent);
        };

        const unsubDrag    = ModuleBus.subscribe('module:dragged', handleModuleDrag);
        const unsubConnect = ModuleBus.subscribe('module:connect', handleModuleConnect);
        const unsubOpenUi  = ModuleBus.subscribe('ui:module:open', handleOpenModuleUi);

        return () => {
            unsubDrag();
            unsubConnect();
            unsubOpenUi();
        };
    }, [updateModulePosition, addConnection, handleConfigChange]);

    // 4) Panel del módulo seleccionado
    const ModulePanel = useMemo(() => {
        if (!selectedModuleUi) return null;
        const UiComponent = selectedModuleUi;
        return <UiComponent />;
    }, [selectedModuleUi]);

    // 5) Estado de carga
    if (status === 'loading' || !isInitialized) {
        return (
            <div className="w-full h-screen flex items-center justify-center bg-background text-white">
                Verificando sesión y cargando datos...
            </div>
        );
    }

    // 6) Render final
    return (
        <div className="w-screen h-screen bg-background flex">
            <ModulesSidebar onConfigChange={handleConfigChange} />

            <main className="flex-1 relative">
                <PhaserCanvas visualConfig={visualConfig} />
            </main>

            <div
                className={`absolute top-0 right-0 h-full w-96 bg-surface/80 backdrop-blur-sm shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${selectedModuleUi ? 'translate-x-0' : 'translate-x-full'}`}
            >
                <button
                    onClick={() => setSelectedModuleUi(null)}
                    className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600
                     rounded-full w-8 h-8 z-10 flex items-center justify-center font-bold"
                >
                    X
                </button>
                <div className="p-4 pt-12 h-full overflow-y-auto">{ModulePanel}</div>
            </div>
        </div>
    );
}
