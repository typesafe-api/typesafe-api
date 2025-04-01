import { z } from 'zod';

export type ZodEmptyObject = z.ZodRecord<z.ZodString, z.ZodNever>;
export type ZodPrimitive = z.ZodString | z.ZodNumber | z.ZodBoolean;
export type ZopOptionalPrimitive = z.ZodOptional<ZodPrimitive> | ZodPrimitive;
