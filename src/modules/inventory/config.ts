import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

export interface ModuleConfig {
    id: string;
    name: string;
    dependencies: string[];
    apiBasePath: string;
    // Componente de interfaz de usuario con props desconocidos.
    UiComponent: ComponentType<unknown>;
}

export const inventoryModuleConfig: ModuleConfig = {
    id: 'inventory',
    name: 'Gestión de Inventario',
    dependencies: [],
    apiBasePath: '/api/modules/inventory',
    UiComponent: dynamic(() => import('./ui')),
};
