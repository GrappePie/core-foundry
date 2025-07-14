import dynamic from 'next/dynamic';
import type { ModuleConfig } from '@/modules/module-types';

export const crmModuleConfig: ModuleConfig = {
    id: 'crm',
    name: 'Gestión de Clientes (CRM)',
    dependencies: [],
    apiBasePath: '/api/modules/crm',
    // CORRECCIÓN: Se elimina el tipo ComponentType que no se usaba.
    UiComponent: dynamic(() => import('./ui')),
    settingsSchema: {
        type: 'object',
        properties: {
            customFields: { type: 'array', items: { type: 'string' } },
        },
    },
    defaultSettings: { customFields: [] },
};
