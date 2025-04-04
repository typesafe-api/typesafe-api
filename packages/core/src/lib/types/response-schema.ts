import { z } from 'zod';
import { ZodEmptyObject, ZopOptionalPrimitive } from './zod';

export type RespBody = Record<string, z.ZodTypeAny>;
export type RespHeaders = Record<string, ZopOptionalPrimitive>;

export type AbstractResponseSchemaShape = {
  body: z.ZodObject<RespBody> | ZodEmptyObject;
  headers: z.ZodObject<RespHeaders> | ZodEmptyObject;
};

export type AbstractResponseSchema = z.ZodObject<AbstractResponseSchemaShape>;

export type AbstractResponse = z.infer<AbstractResponseSchema>;
