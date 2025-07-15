'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AcceptInvitePage() {
  const [status, setStatus] = useState('Procesando invitación...');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/tenant/invite/accept', { method: 'POST' })
      .then(res => res.ok ? res.json() : Promise.reject())
      .then(() => {
        setStatus('Invitación aceptada. Redirigiendo...');
        setTimeout(() => router.push('/dashboard'), 1500);
      })
      .catch(() => setStatus('Error al aceptar la invitación'));
  }, [router]);

  return <div className="p-4 text-white">{status}</div>;
}
