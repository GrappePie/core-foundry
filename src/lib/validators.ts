export function parseString(value: unknown, field: string): string {
    if (typeof value !== 'string') throw new Error(`Invalid ${field}`);
    const trimmed = value.trim();
    if (!trimmed) throw new Error(`Invalid ${field}`);
    return trimmed;
}

export function parseStringArray(value: unknown, field: string): string[] {
    if (!Array.isArray(value)) throw new Error(`Invalid ${field}`);
    return value.map(v => parseString(v, field));
}

import type { VisualConfig } from './types';

export function parseVisualConfig(value: unknown): VisualConfig {
    if (!value || typeof value !== 'object') throw new Error('Invalid visualConfig');
    const { positions, connections } = value as Record<string, unknown>;
    if (!positions || typeof positions !== 'object') throw new Error('Invalid visualConfig.positions');
    if (!Array.isArray(connections)) throw new Error('Invalid visualConfig.connections');

    const parsedPositions: Record<string, { x: number; y: number }> = {};
    for (const [k, pos] of Object.entries(positions as Record<string, unknown>)) {
        if (!pos || typeof pos !== 'object') throw new Error('Invalid position');
        const { x, y } = pos as Record<string, unknown>;
        if (typeof x !== 'number' || typeof y !== 'number') throw new Error('Invalid position');
        parsedPositions[k] = { x, y };
    }

    const parsedConnections = (connections as unknown[]).map((c) => {
        if (!c || typeof c !== 'object') throw new Error('Invalid connection');
        const { from, to } = c as Record<string, unknown>;
        const parsedFrom = parseString(from, 'connection.from');
        const parsedTo = parseString(to, 'connection.to');
        return { from: parsedFrom, to: parsedTo };
    });

    return { positions: parsedPositions, connections: parsedConnections };
}
