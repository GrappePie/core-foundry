import { PrismaClient } from '@prisma/client';

// Declaramos 'cachedPrisma' en el ámbito global para que no se vea afectado
// por el Hot Module Replacement (HMR) de Next.js en desarrollo.
declare global {
    var cachedPrisma: PrismaClient | undefined;
}

// Esta práctica evita crear múltiples instancias de PrismaClient en desarrollo.
export const db = global.cachedPrisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    global.cachedPrisma = db;
}
