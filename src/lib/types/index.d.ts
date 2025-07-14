// --- Tipos de Datos Principales ---
export interface ModulePosition {
    x: number;
    y: number;
}

export interface ModuleConnection {
    from: string; // ID del módulo de origen
    to: string;   // ID del módulo de destino
}

export interface VisualConfig {
    positions: Record<string, ModulePosition>; // Un objeto donde la clave es el ID del módulo
    connections: ModuleConnection[];
}

export interface Tenant {
    id: string;
    name:string;
    activeModules: string[];
    visualConfig: VisualConfig;
}

export type TenantRole = 'OWNER' | 'ADMIN' | 'EDITOR' | 'VIEWER';

export interface TenantUser {
    tenantId: string;
    userId: string;
    role: TenantRole;
}

export interface Invitation {
    id: string;
    tenantId: string;
    email: string;
    role: TenantRole;
    accepted: boolean;
}


// --- Tipos para el Bus de Eventos ---
// Define los tipos de eventos que pueden ocurrir en la aplicación.
export type AppEventType =
    | 'module:dragged'
    | 'module:connect'
    | 'ui:module:open'
    | 'store:updated';

// Define la estructura base para todos los eventos del bus.
export interface AppEvent<T = unknown> {
    type: AppEventType;
    payload: T;
}

// Payloads específicos para cada tipo de evento para un tipado más estricto.
export interface ModuleDraggedPayload {
    moduleId: string;
    position: ModulePosition;
}

export interface ModuleConnectPayload {
    from: string;
    to: string;
}

export interface ModuleEvent {
    type: string; // Se añade un tipo de evento para el enrutamiento
    // CORRECCIÓN: Se usa 'unknown' en lugar de 'any' para un tipado más seguro.
    payload: unknown;
}
