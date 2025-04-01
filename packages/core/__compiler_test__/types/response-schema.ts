import { AbstractResponseSchema } from '../../src/types/response-schema';
import { z } from 'zod';
import { schemaHelpers } from '../../src/util/schema';

/*
 * Set up a valid response
 */

const ValidResponseSchema = z.object({
  body: z.object({
    bodyField: z.string(),
  }),
  headers: z.object({
    headerField: z.string(),
  }),
}) satisfies AbstractResponseSchema;

type ValidResponse = z.infer<typeof ValidResponseSchema>;

/*
 * Create a valid response
 */

const validResponse: ValidResponse = {
  body: {
    bodyField: 'bodyField',
  },
  headers: {
    headerField: 'headerField',
  },
};

/*
 * Make sure all fields are required
 */

const missingBody: ValidResponse = {
  ...validResponse,
  body: undefined,
};

const missingHeaders: ValidResponse = {
  ...validResponse,
  headers: undefined,
};

/*
 * Make sure keys are well validated
 */

const invalidBodyKey: ValidResponse = {
  ...validResponse,
  body: {
    notAValidBodyKey: 'value',
  },
};

const invalidHeaderKey: ValidResponse = {
  ...validResponse,
  headers: {
    notAValidHeaderKey: 'value',
  },
};

/*
 * Make sure types are well validated
 */

const invalidBodyType: ValidResponse = {
  ...validResponse,
  body: {
    // this should be a string
    bodyField: 1,
  },
};

const invalidHeaderType: ValidResponse = {
  ...validResponse,
  headers: {
    // this should be a string
    headerField: 1,
  },
};

/*
 * Try to create schema with missing fields
 */

const missingBodySchema = z.object({
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractResponseSchema;

const missingHeadersSchema = z.object({
  body: schemaHelpers.emptyObject(),
}) satisfies AbstractResponseSchema;

/*
 * Try to create schema with invalid types
 */

const invalidBodyTypeSchema = z.object({
  body: z.array(z.string()),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractResponseSchema;

const invalidHeaderTypeSchema = z.object({
  body: schemaHelpers.emptyObject(),
  headers: z.array(z.string()),
}) satisfies AbstractResponseSchema;

// @expected-compiler-errors-start
// (39,3): error TS2322: Type 'undefined' is not assignable to type '{ bodyField: string; }'.
// (44,3): error TS2322: Type 'undefined' is not assignable to type '{ headerField: string; }'.
// (54,5): error TS2353: Object literal may only specify known properties, and 'notAValidBodyKey' does not exist in type '{ bodyField: string; }'.
// (61,5): error TS2353: Object literal may only specify known properties, and 'notAValidHeaderKey' does not exist in type '{ headerField: string; }'.
// (73,5): error TS2322: Type 'number' is not assignable to type 'string'.
// (81,5): error TS2322: Type 'number' is not assignable to type 'string'.
// (91,4): error TS1360: Type 'ZodObject<{ headers: ZodEmptyObject; }, "strip", ZodTypeAny, { headers: Record<string, never>; }, { headers: Record<string, never>; }>' does not satisfy the expected type 'AbstractResponseSchema'.
// (95,4): error TS1360: Type 'ZodObject<{ body: ZodEmptyObject; }, "strip", ZodTypeAny, { body: Record<string, never>; }, { body: Record<string, never>; }>' does not satisfy the expected type 'AbstractResponseSchema'.
// (104,4): error TS1360: Type 'ZodObject<{ body: ZodArray<ZodString, "many">; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { body: string[]; headers: Record<string, never>; }, { ...; }>' does not satisfy the expected type 'AbstractResponseSchema'.
// (109,4): error TS1360: Type 'ZodObject<{ body: ZodEmptyObject; headers: ZodArray<ZodString, "many">; }, "strip", ZodTypeAny, { body: Record<string, never>; headers: string[]; }, { ...; }>' does not satisfy the expected type 'AbstractResponseSchema'.
