import React from 'react';
import { render, screen, fireEvent, act, waitFor } from '@testing-library/react';
import { useMainStore } from '@/core/store/useMainStore';
import { ModulesSidebar } from '@/components/ui/ModulesSidebar';

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
        // Espera que onConfigChange haya sido llamado y el toggle se actualice
        await waitFor(() => expect(handleConfigChange).toHaveBeenCalledTimes(1));
        await waitFor(() => expect(crmToggle).toBeChecked());
    });
});
