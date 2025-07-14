import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { ModulesSidebar } from '@/components/ui/ModulesSidebar';
import { useMainStore } from '@/core/store/useMainStore';

// Mock del ModuleLoader
jest.mock('@/core/ModuleLoader', () => ({
    getAllModules: () => [
        { id: 'inventory', name: 'Inventario' },
        { id: 'crm', name: 'CRM' },
    ],
}));

describe('ModulesSidebar', () => {
    it('renderiza los módulos y reacciona a los clics', async () => {
        const handleConfigChange = jest.fn();

        // Estado inicial: solo 'inventory' está activo
        act(() => {
            useMainStore.setState({ activeModules: ['inventory'] });
        });

        render(<ModulesSidebar onConfigChange={handleConfigChange} />);

        const inventoryToggle = screen.getByLabelText('Inventario');
        const crmToggle = screen.getByLabelText('CRM');

        // Verifica el estado inicial de los toggles
        expect(inventoryToggle).toBeChecked();
        expect(crmToggle).not.toBeChecked();

        // Simula el clic para activar el módulo CRM
        fireEvent.click(crmToggle);

        // Verifica que la función de callback fue llamada
        expect(handleConfigChange).toHaveBeenCalledTimes(1);
        // Verifica que el estado del store se actualizó (el toggle ahora está checked)
        expect(crmToggle).toBeChecked();
    });
});
