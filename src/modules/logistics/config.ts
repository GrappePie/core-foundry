import dynamic from 'next/dynamic';
import type { ModuleConfig } from '@/modules/inventory/config';

export const logisticsModuleConfig: ModuleConfig = {
    id: 'logistics',
    name: 'Logística y Envíos',
    dependencies: ['inventory'],
    apiBasePath: '/api/modules/logistics',
    // CORRECCIÓN: Se elimina el tipo ComponentType que no se usaba.
    UiComponent: dynamic(() => import('./ui')),
};
