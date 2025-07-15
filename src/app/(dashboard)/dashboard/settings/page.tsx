'use client';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/tenant/me')
      .then(res => res.json())
      .then(data => { setName(data.name); setLoading(false); });
  }, []);

  const handleSave = async () => {
    await fetch('/api/tenant/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    });
  };

  const handlePortal = async () => {
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl mb-4">Ajustes del Tenant</h1>
      <label className="block mb-2">Nombre</label>
      <input value={name} onChange={e => setName(e.target.value)} className="text-black mb-4" />
      <button onClick={handleSave} className="bg-blue-600 px-4 py-2 rounded mr-2">Guardar</button>
      <button onClick={handlePortal} className="bg-secondary px-4 py-2 rounded">Gestionar Suscripción</button>
    </div>
  );
}
