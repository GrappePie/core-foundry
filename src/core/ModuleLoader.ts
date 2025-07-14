import { inventoryModuleConfig } from '@/modules/inventory/config';
import { crmModuleConfig }       from '@/modules/crm/config';
import { logisticsModuleConfig } from '@/modules/logistics/config';
import type { ModuleConfig } from '@/modules/module-types';

// Usamos la interfaz ModuleConfig importada para asegurar consistencia entre módulos.

const CORE_MODULES: ModuleConfig[] = [
    inventoryModuleConfig,
    crmModuleConfig,
    logisticsModuleConfig,
];

const EXTERNAL_MODULES: ModuleConfig[] = [];

export function registerExternalModule(config: ModuleConfig) {
    EXTERNAL_MODULES.push(config);
}

/**
 * Devuelve un array con las configuraciones de todos los módulos registrados.
 * @returns {ModuleConfig[]} Un array de todas las configuraciones de módulos.
 */
export function getAllModules(): ModuleConfig[] {
    return [...CORE_MODULES, ...EXTERNAL_MODULES];
}

/**
 * Busca y devuelve la configuración de un módulo por su ID.
 * @param {string} id - El ID del módulo a buscar.
 * @returns {ModuleConfig | undefined} La configuración del módulo o undefined si no se encuentra.
 */
export function getModuleById(id: string): ModuleConfig | undefined {
    return [...CORE_MODULES, ...EXTERNAL_MODULES].find(m => m.id === id);
}
