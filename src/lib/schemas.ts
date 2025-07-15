import { z } from 'zod';

export const positionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const connectionSchema = z.object({
  from: z.string(),
  to: z.string(),
});

export const visualConfigSchema = z.object({
  positions: z.record(positionSchema),
  connections: z.array(connectionSchema),
});

export const updateTenantSchema = z.object({
  activeModules: z.array(z.string()),
  visualConfig: visualConfigSchema,
});

export type UpdateTenantInput = z.infer<typeof updateTenantSchema>;
