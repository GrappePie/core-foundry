'use client';
import { useEffect, useState } from 'react';
import type { TenantRole } from '@/lib/types';

interface Member {
  user: {
    id: string;
    email: string | null;
    name: string | null;
  };
  role: TenantRole;
}

export default function SettingsPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('EDITOR');

  const fetchMembers = () => {
    fetch('/api/tenant/members')
      .then(res => res.json())
      .then(setMembers);
  };

  useEffect(() => {
    fetch('/api/tenant/me')
      .then(res => res.json())
      .then(data => { setName(data.name); setLoading(false); });
    fetchMembers();
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

  const handleInvite = async () => {
    await fetch('/api/tenant/invite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
    });
    setInviteEmail('');
    fetchMembers();
  };

  const handleRemove = async (userId: string) => {
    await fetch('/api/tenant/members', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    fetchMembers();
  };

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="p-4 text-white">
      <h1 className="text-2xl mb-4">Ajustes del Tenant</h1>
      <label className="block mb-2">Nombre</label>
      <input value={name} onChange={e => setName(e.target.value)} className="text-black mb-4" />
      <button onClick={handleSave} className="bg-blue-600 px-4 py-2 rounded mr-2">Guardar</button>
      <button onClick={handlePortal} className="bg-secondary px-4 py-2 rounded">Gestionar Suscripción</button>

      <hr className="my-4 border-gray-700" />
      <h2 className="text-xl mb-2">Invitar usuario</h2>
      <div className="mb-4 space-x-2">
        <input
          type="email"
          placeholder="email@example.com"
          value={inviteEmail}
          onChange={e => setInviteEmail(e.target.value)}
          className="text-black px-2 py-1"
        />
        <select
          value={inviteRole}
          onChange={e => setInviteRole(e.target.value)}
          className="text-black px-2 py-1"
        >
          <option value="ADMIN">Admin</option>
          <option value="EDITOR">Editor</option>
          <option value="VIEWER">Espectador</option>
        </select>
        <button onClick={handleInvite} className="bg-blue-600 px-3 py-1 rounded">Invitar</button>
      </div>

      <h2 className="text-xl mb-2">Miembros</h2>
      <table className="w-full text-left text-sm">
        <thead>
          <tr>
            <th className="py-1">Email</th>
            <th className="py-1">Rol</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.user.id} className="border-t border-gray-700">
              <td className="py-1">{m.user.email}</td>
              <td className="py-1">{m.role}</td>
              <td className="py-1 text-right">
                <button onClick={() => handleRemove(m.user.id)} className="text-red-500">Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
