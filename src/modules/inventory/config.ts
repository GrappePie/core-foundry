import dynamic from 'next/dynamic';
import type { ModuleConfig } from '@/modules/module-types';

export const inventoryModuleConfig: ModuleConfig = {
    id: 'inventory',
    name: 'Gestión de Inventario',
    dependencies: [],
    apiBasePath: '/api/modules/inventory',
    UiComponent: dynamic(() => import('./ui')),
    settingsSchema: {
        type: 'object',
        properties: {
            itemsPerPage: { type: 'number', default: 20 },
        },
    },
    defaultSettings: { itemsPerPage: 20 },
};
