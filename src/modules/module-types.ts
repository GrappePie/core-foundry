import type { ComponentType } from 'react';

export interface ModuleConfig {
    id: string;
    name: string;
    dependencies: string[];
    apiBasePath: string;
    UiComponent: ComponentType<unknown>;
    settingsSchema?: object;
    defaultSettings?: Record<string, unknown>;
}
