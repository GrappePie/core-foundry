'use client';

import { useState } from 'react';
import { useMainStore } from '@/core/store/useMainStore';
import { getAllModules } from '@/core/ModuleLoader';
import { VisualConfig } from '@/lib/types';
import Link from 'next/link';

interface ModulesSidebarProps {
    onConfigChange: (newConfig: { activeModules: string[]; visualConfig: VisualConfig }) => Promise<void>;
}

export const ModulesSidebar = ({ onConfigChange }: ModulesSidebarProps) => {
    const activeModules = useMainStore((state) => state.activeModules) ?? [];
    const toggleModule = useMainStore((state) => state.toggleModule);
    const allModules = getAllModules();
    const [loadingModule, setLoadingModule] = useState<string | null>(null);

    const handleToggle = async (moduleId: string) => {
        setLoadingModule(moduleId);
        try {
            const newState = toggleModule(moduleId);
            await onConfigChange(newState);
        } catch (error) {
            console.error(`Error al cambiar el estado del módulo ${moduleId}:`, error);
        } finally {
            setLoadingModule(null);
        }
    };

    return (
        <div className="w-64 h-full bg-surface/80 p-4 shadow-2xl backdrop-blur-sm text-white flex-shrink-0">
            <h2 className="text-xl font-bold mb-4">Fábrica de Módulos</h2>
            <ul className="space-y-3">
                {allModules.map((module) => {
                    const isChecked = activeModules.includes(module.id);
                    const isLoading = loadingModule === module.id;
                    return (
                        <li
                            key={module.id}
                            className={`flex items-center justify-between bg-gray-700 p-2 rounded-md transition-opacity ${
                                isLoading ? 'opacity-50' : 'opacity-100'
                            }`}
                        >
                            <label htmlFor={`toggle-${module.id}`} className="font-semibold select-none cursor-pointer">
                                {module.name}
                            </label>
                            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
                                <input
                                    type="checkbox"
                                    name={`toggle-${module.id}`}
                                    id={`toggle-${module.id}`}
                                    checked={isChecked}
                                    onChange={() => handleToggle(module.id)}
                                    disabled={isLoading}
                                    className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                                />
                                <label
                                    htmlFor={`toggle-${module.id}`}
                                    className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"
                                ></label>
                            </div>
                        </li>
                    );
                })}
            </ul>
            <hr className="my-4 border-gray-600" />
            <Link href="/dashboard/settings" className="text-sm hover:underline">
                Ajustes del Tenant
            </Link>
            <style jsx>{`
                .toggle-checkbox {
                    @apply transition-all duration-300 ease-in-out;
                }
                .toggle-checkbox:checked {
                    right: 0;
                    border-color: #10b981;
                    transform: translateX(100%);
                }
                .toggle-checkbox:checked + .toggle-label {
                    background-color: #10b981;
                }
                .toggle-checkbox:disabled {
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
};
