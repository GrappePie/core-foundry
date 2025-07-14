import pino from 'pino';

/**
 * Logger estructurado basado en Pino.
 * Genera logs en formato JSON, lo cual es ideal para ser procesado por colectores como Fluent Bit.
 */
const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    formatters: {
        level: (label) => {
            return { level: label };
        },
    },
    timestamp: pino.stdTimeFunctions.isoTime,
});

export default logger;
