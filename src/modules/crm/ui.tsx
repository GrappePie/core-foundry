'use client';
import { useState, useEffect } from 'react';

// Simulación de un tipo de dato para un cliente
interface Customer {
    id: string;
    name: string;
    email: string;
    company: string;
}

const CrmUI = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);

    // Estado de los inputs del formulario
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [company, setCompany] = useState('');

    // Función para cargar la lista de clientes
    const fetchCustomers = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/modules/crm', {
                credentials: 'include',
            });
            if (!res.ok) {
                console.error('Error al obtener clientes:', res.statusText);
                return;
            }
            const data: Customer[] = await res.json();
            setCustomers(data);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Carga inicial
    useEffect(() => {
        fetchCustomers();
    }, []);

    // Envía el formulario para crear un nuevo cliente
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/modules/crm', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, company }),
            });
            if (!res.ok) {
                console.error('Error al crear cliente:', await res.text());
                return;
            }
            // Limpiar inputs y recargar la lista
            setName('');
            setEmail('');
            setCompany('');
            await fetchCustomers();
        } catch (err) {
            console.error('Post error:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 bg-gray-800 rounded-lg text-white">
            <h3 className="text-lg font-bold mb-4">Módulo CRM</h3>

            <form onSubmit={handleSubmit} className="space-y-2 mb-4">
                <input
                    type="text"
                    placeholder="Nombre del contacto"
                    className="w-full bg-gray-700 p-2 rounded"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email del contacto"
                    className="w-full bg-gray-700 p-2 rounded"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Empresa"
                    className="w-full bg-gray-700 p-2 rounded"
                    value={company}
                    onChange={e => setCompany(e.target.value)}
                    required
                />
                <button
                    type="submit"
                    className="w-full bg-primary text-white p-2 rounded"
                    disabled={loading}
                >
                    {loading ? 'Procesando...' : 'Añadir Contacto'}
                </button>
            </form>

            <h4 className="font-semibold mb-2">Lista de Clientes</h4>
            {loading && customers.length === 0 ? (
                <p>Cargando...</p>
            ) : (
                <ul className="space-y-2">
                    {customers.map(customer => (
                        <li key={customer.id} className="bg-gray-700 p-2 rounded">
                            <p className="font-bold">{customer.name}</p>
                            <p className="text-sm text-gray-400">{customer.email}</p>
                            <p className="text-sm text-gray-400">{customer.company}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default CrmUI;
