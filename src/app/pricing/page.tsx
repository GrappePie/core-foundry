'use client';

const plans = [
  { id: 'price_basic', name: 'Básico', price: '$10/mes', desc: 'Funcionalidades esenciales' },
  { id: 'price_pro', name: 'Pro', price: '$20/mes', desc: 'Para equipos que crecen' },
  { id: 'price_enterprise', name: 'Empresarial', price: '$50/mes', desc: 'Soporte completo y escalabilidad' },
];

export default function PricingPage() {
  const subscribe = async (plan: string) => {
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan }),
    });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  };

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl text-center mb-6">Elige tu plan</h1>
      <div className="flex flex-col md:flex-row gap-4 justify-center">
        {plans.map(p => (
          <div key={p.id} className="bg-surface p-6 rounded shadow text-center">
            <h2 className="text-2xl mb-2">{p.name}</h2>
            <p className="mb-2 font-semibold">{p.price}</p>
            <p className="mb-4 text-text-secondary">{p.desc}</p>
            <button onClick={() => subscribe(p.id)} className="bg-primary px-4 py-2 rounded">Suscribirse</button>
          </div>
        ))}
      </div>
    </div>
  );
}
