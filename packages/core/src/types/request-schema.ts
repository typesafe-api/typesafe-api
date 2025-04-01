import { z } from 'zod';
import { ZodEmptyObject, ZopOptionalPrimitive } from './zod';

export type ReqQuery = Record<string, ZopOptionalPrimitive>;
export type ReqParams = Record<string, ZopOptionalPrimitive>;
export type ReqBody = Record<string, z.ZodTypeAny>;
export type ReqHeaders = Record<string, ZopOptionalPrimitive>;

export type ZodRequestSchema = z.ZodObject<{
  query: z.ZodObject<ReqQuery> | ZodEmptyObject;
  params: z.ZodObject<ReqParams> | ZodEmptyObject;
  body: z.ZodObject<ReqBody> | ZodEmptyObject;
  headers: z.ZodObject<ReqHeaders> | ZodEmptyObject;
}>;

export type AbstractRequest = z.infer<ZodRequestSchema>;
