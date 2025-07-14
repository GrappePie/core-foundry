'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useMainStore } from '@/core/store/useMainStore';
import ModuleBus from '@/core/bus/ModuleBus';
import { ModuleDraggedPayload, ModuleConnectPayload, VisualConfig, Tenant } from '@/lib/types';
import { ModulesSidebar } from '@/components/ui/ModulesSidebar';

// --- Dynamic Imports & Module Registry ---
const PhaserCanvas = dynamic(() => import('@/components/game/PhaserCanvas'), {
    ssr: false,
    loading: () => <div className="w-full h-full flex items-center justify-center"><p className="text-white text-center text-2xl">Cargando Fábrica...</p></div>
});

import { inventoryModuleConfig } from '@/modules/inventory/config';
import { crmModuleConfig } from '@/modules/crm/config';
import { logisticsModuleConfig } from '@/modules/logistics/config';

const moduleRegistry = {
    'inventory': inventoryModuleConfig,
    'crm': crmModuleConfig,
    'logistics': logisticsModuleConfig,
};

// CORRECCIÓN: Se añade la definición de la prop que el componente espera recibir.
interface DashboardClientProps {
    initialTenantData: Tenant;
}

export default function DashboardClient({ initialTenantData }: DashboardClientProps) {
    const { isInitialized, setInitialData, updateModulePosition, addConnection, visualConfig } = useMainStore();
    const [selectedModuleUi, setSelectedModuleUi] = useState<React.ComponentType | null>(null);

    // Carga inicial de datos desde las props del Server Component
    useEffect(() => {
        if (!isInitialized) {
            setInitialData(initialTenantData);
        }
    }, [isInitialized, setInitialData, initialTenantData]);

    const handleConfigChange = useCallback(async (data: { activeModules: string[], visualConfig: VisualConfig }) => {
        try {
            await fetch('/api/tenant/me', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        } catch (error) {
            console.error('[React] Error al persistir la configuración:', error);
        }
    }, []);

    useEffect(() => {
        const handleModuleDrag = (payload: ModuleDraggedPayload) => {
            const newConfig = updateModulePosition(payload.moduleId, payload.position);
            handleConfigChange({ activeModules: useMainStore.getState().activeModules, visualConfig: newConfig });
        };

        const handleModuleConnect = (payload: ModuleConnectPayload) => {
            const newConfig = addConnection(payload);
            handleConfigChange({ activeModules: useMainStore.getState().activeModules, visualConfig: newConfig });
        };

        const handleOpenModuleUi = ({ moduleId }: { moduleId: string }) => {
            const config = moduleRegistry[moduleId as keyof typeof moduleRegistry];
            if (config) {
                setSelectedModuleUi(() => config.UiComponent);
            }
        };

        const unsubDrag = ModuleBus.subscribe('module:dragged', handleModuleDrag);
        const unsubConnect = ModuleBus.subscribe('module:connect', handleModuleConnect);
        const unsubOpenUi = ModuleBus.subscribe('ui:module:open', handleOpenModuleUi);

        return () => {
            unsubDrag();
            unsubConnect();
            unsubOpenUi();
        };
    }, [updateModulePosition, addConnection, handleConfigChange]);

    const ModulePanel = useMemo(() => {
        if (!selectedModuleUi) return null;
        const UiComponent = selectedModuleUi;
        return <UiComponent />;
    }, [selectedModuleUi]);

    if (!isInitialized) {
        return <div className="w-full h-screen flex items-center justify-center bg-background text-white">Inicializando Dashboard...</div>;
    }

    return (
        <div className="w-screen h-screen bg-background flex flex-row">
            <ModulesSidebar onConfigChange={handleConfigChange} />

            <main className="flex-1 relative">
                <PhaserCanvas visualConfig={visualConfig} />
            </main>

            <div className={`absolute top-0 right-0 h-full w-96 bg-surface/80 backdrop-blur-sm shadow-2xl transition-transform duration-300 ease-in-out ${selectedModuleUi ? 'translate-x-0' : 'translate-x-full'}`}>
                <button onClick={() => setSelectedModuleUi(null)} className="absolute top-2 right-2 text-white bg-red-500 hover:bg-red-600 rounded-full w-8 h-8 z-10 flex items-center justify-center font-bold">X</button>
                <div className="p-4 pt-12 h-full overflow-y-auto">
                    {ModulePanel}
                </div>
            </div>
        </div>
    );
}
