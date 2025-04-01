import { z } from 'zod';
import { ZodEmptyObject } from './zod';

export type ZodPrimitive = z.ZodString | z.ZodNumber | z.ZodBoolean | z.ZodNever;

export type ReqQuery = Record<string, ZodPrimitive>;
export type ReqParams = Record<string, ZodPrimitive>;
export type ReqBody = Record<string, z.ZodTypeAny>;
export type ReqHeaders = Record<string, ZodPrimitive>;

export type ZodRequestSchema = z.ZodObject<{
  query: z.ZodObject<ReqQuery> | ZodEmptyObject;
  params: z.ZodObject<ReqParams> | ZodEmptyObject;
  body: z.ZodObject<ReqBody> | ZodEmptyObject;
  headers: z.ZodObject<ReqHeaders> | ZodEmptyObject;
}>;
