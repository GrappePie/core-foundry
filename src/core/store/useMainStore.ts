import { create } from 'zustand';
import { Tenant, VisualConfig, ModulePosition, ModuleConnection } from '@/lib/types';

interface MainState {
    isInitialized: boolean;
    activeModules: string[];
    visualConfig: VisualConfig;
    setInitialData: (data: Tenant | null) => void;
    updateModulePosition: (moduleId: string, position: ModulePosition) => VisualConfig;
    addConnection: (connection: ModuleConnection) => VisualConfig;
    toggleModule: (moduleId: string) => { activeModules: string[]; visualConfig: VisualConfig };
}

export const useMainStore = create<MainState>((set, get) => ({
    isInitialized: false,
    activeModules: [],
    visualConfig: { positions: {}, connections: [] },

    setInitialData: (data) => set({
        // Manejo de data null o undefined
        activeModules: Array.isArray(data?.activeModules) ? data!.activeModules : [],
        visualConfig: data?.visualConfig ?? { positions: {}, connections: [] },
        isInitialized: true,
    }),

    updateModulePosition: (moduleId, position) => {
        const state = get();
        const newVisualConfig = {
            ...state.visualConfig,
            positions: { ...state.visualConfig.positions, [moduleId]: position },
        };
        set({ visualConfig: newVisualConfig });
        return newVisualConfig;
    },

    addConnection: (connection) => {
        const state = get();
        const newVisualConfig = { ...state.visualConfig };
        if (!state.visualConfig.connections.some(c => c.from === connection.from && c.to === connection.to)) {
            newVisualConfig.connections = [...state.visualConfig.connections, connection];
            set({ visualConfig: newVisualConfig });
        }
        return newVisualConfig;
    },

    toggleModule: (moduleId: string) => {
        const state = get();
        const activeModules = Array.isArray(state.activeModules) ? state.activeModules : [];
        const currentVisualConfig = state.visualConfig ?? { positions: {}, connections: [] };
        const isActive = activeModules.includes(moduleId);

        let newActiveModules: string[];
        let newVisualConfig: VisualConfig;

        if (isActive) {
            newActiveModules = activeModules.filter(id => id !== moduleId);
            const newPositions = { ...currentVisualConfig.positions };
            delete newPositions[moduleId];
            const newConnections = currentVisualConfig.connections.filter(
                c => c.from !== moduleId && c.to !== moduleId
            );
            newVisualConfig = { positions: newPositions, connections: newConnections };
        } else {
            newActiveModules = [...activeModules, moduleId];
            const newPositions = {
                ...currentVisualConfig.positions,
                [moduleId]: { x: 150 + Math.random() * 100, y: 150 + Math.random() * 100 },
            };
            newVisualConfig = { positions: newPositions, connections: currentVisualConfig.connections };
        }

        set({ activeModules: newActiveModules, visualConfig: newVisualConfig });
        return { activeModules: newActiveModules, visualConfig: newVisualConfig };
    },
}));
