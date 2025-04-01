import { z } from 'zod';

export type ZodEmptyObject = z.ZodRecord<z.ZodString, z.ZodNever>;
