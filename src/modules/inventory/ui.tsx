'use client';

import { useState } from 'react';
import ModuleBus from '@/core/bus/ModuleBus';

/**
 * La interfaz de usuario para el módulo de inventario.
 * Se mostrará en un panel cuando el usuario haga clic en el "edificio"
 * de inventario en el mapa de Phaser.
 */
const InventoryUI = () => {
    const [item, setItem] = useState('Placas de Acero');
    const [quantity, setQuantity] = useState(150);

    const handleSendData = () => {
        if (!item || quantity <= 0) {
            alert('Por favor, introduce un item y una cantidad válida.');
            return;
        }

        console.log(`[InventoryUI] Enviando ${quantity} de ${item} a Logística...`);

        // Publica un evento en el bus.
        // El módulo de 'logistics' podría estar escuchando este evento.
        ModuleBus.publish({
            type: 'module:data:transfer',
            payload: {
                from: 'inventory',
                to: 'logistics', // Módulo de destino hipotético
                payload: { item, quantity },
            }
        });

        alert(`¡${quantity} de ${item} enviados!`);
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg text-white">
            <h3 className="text-lg font-bold mb-4">Módulo de Inventario</h3>
            <div className="space-y-4">
                <div>
                    <label htmlFor="item" className="block text-sm font-medium text-gray-300">
                        Item a Enviar
                    </label>
                    <input
                        type="text"
                        id="item"
                        value={item}
                        onChange={(e) => setItem(e.target.value)}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <div>
                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-300">
                        Cantidad
                    </label>
                    <input
                        type="number"
                        id="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value, 10))}
                        className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                </div>
                <button
                    onClick={handleSendData}
                    className="w-full bg-secondary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-md transition-colors"
                >
                    Enviar a Logística
                </button>
            </div>
        </div>
    );
};

export default InventoryUI;
