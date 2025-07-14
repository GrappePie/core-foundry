import { useMainStore } from '@/core/store/useMainStore';
import { act } from '@testing-library/react';

describe('useMainStore', () => {
    // Resetea el estado del store antes de cada test
    beforeEach(() => {
        act(() => {
            useMainStore.setState({
                isInitialized: false,
                activeModules: [],
                visualConfig: { positions: {}, connections: [] },
            });
        });
    });

    it('debería activar un módulo correctamente', () => {
        act(() => {
            useMainStore.getState().toggleModule('crm');
        });

        const state = useMainStore.getState();
        expect(state.activeModules).toContain('crm');
        expect(state.visualConfig.positions['crm']).toBeDefined();
    });

    it('debería desactivar un módulo y limpiar sus conexiones', () => {
        // Estado inicial: crm y logistics activos, con una conexión
        act(() => {
            useMainStore.setState({
                activeModules: ['crm', 'logistics'],
                visualConfig: {
                    positions: { crm: { x: 1, y: 1 }, logistics: { x: 2, y: 2 } },
                    connections: [{ from: 'crm', to: 'logistics' }],
                },
            });
        });

        // Desactivamos 'crm'
        act(() => {
            useMainStore.getState().toggleModule('crm');
        });

        const state = useMainStore.getState();
        expect(state.activeModules).not.toContain('crm');
        expect(state.activeModules).toContain('logistics');
        expect(state.visualConfig.positions['crm']).toBeUndefined();
        expect(state.visualConfig.connections).toHaveLength(0);
    });
});
