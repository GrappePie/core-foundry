'use client';

import { useState, useEffect } from 'react';

interface Step {
    title: string;
    content: string;
}

const steps: Step[] = [
    {
        title: 'Activa Módulos',
        content: 'Usa la barra lateral para activar los módulos que necesites.',
    },
    {
        title: 'Conecta Módulos',
        content: 'Mantén Shift y haz clic en dos módulos para conectarlos.',
    },
    {
        title: 'Explora la UI',
        content: 'Haz clic en un módulo para abrir su panel de control.',
    },
];

export const DashboardTour = () => {
    const [stepIndex, setStepIndex] = useState(0);
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const visited = localStorage.getItem('hasVisitedDashboard');
        if (!visited) {
            setShow(true);
        }
    }, []);

    const handleNext = () => {
        if (stepIndex < steps.length - 1) {
            setStepIndex(stepIndex + 1);
        } else {
            setShow(false);
            if (typeof window !== 'undefined') {
                localStorage.setItem('hasVisitedDashboard', 'true');
            }
        }
    };

    if (!show) return null;

    const step = steps[stepIndex];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
            <div className="bg-surface p-6 rounded-lg text-white max-w-sm text-center space-y-4">
                <h3 className="text-lg font-bold">{step.title}</h3>
                <p>{step.content}</p>
                <button
                    onClick={handleNext}
                    className="bg-primary hover:bg-primary/80 px-4 py-2 rounded-md"
                >
                    {stepIndex < steps.length - 1 ? 'Siguiente' : 'Finalizar'}
                </button>
            </div>
        </div>
    );
};

export default DashboardTour;
