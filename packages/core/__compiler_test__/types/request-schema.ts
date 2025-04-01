import { AbstractRequestSchema } from '../../src/types/request-schema';
import { z } from 'zod';
import { schemaHelpers } from '../../src/util/schema';

/*
 * Set up a valid request
 */

const ValidRequestSchema = z.object({
  query: z.object({
    name: z.string(),
  }),
  params: schemaHelpers.emptyObject(),
  body: z.object({
    bodyField: z.string(),
  }),
  headers: z.object({
    headerField: z.string(),
  }),
}) satisfies AbstractRequestSchema;

type ValidRequest = z.infer<typeof ValidRequestSchema>;

/*
 * Create a valid request
 */

const validRequest: ValidRequest = {
  query: {
    name: 'John',
  },
  params: {},
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

const missingQuery: ValidRequest = {
  ...validRequest,
  query: undefined,
};

const missingParams: ValidRequest = {
  ...validRequest,
  params: undefined,
};

const missingBody: ValidRequest = {
  ...validRequest,
  body: undefined,
};

const missingHeaders: ValidRequest = {
  ...validRequest,
  headers: undefined,
};

/*
 * Make sure keys are well validated
 */

const invalidQueryKey: ValidRequest = {
  ...validRequest,
  query: {
    notAValidQueryKey: 'value',
  },
};

const invalidBodyKey: ValidRequest = {
  ...validRequest,
  body: {
    notAValidBodyKey: 'value',
  },
};

const invalidHeaderKey: ValidRequest = {
  ...validRequest,
  headers: {
    notAValidHeaderKey: 'value',
  },
};

const invalidParamsKey: ValidRequest = {
  ...validRequest,
  params: {
    notAValidParamKey: 'value',
  },
};

/*
 * Make sure types are well validated
 */

const invalidQueryType: ValidRequest = {
  ...validRequest,
  query: {
    name: ['this should be a string'],
  },
};

const invalidBodyType: ValidRequest = {
  ...validRequest,
  body: {
    // this should be a string
    bodyField: 1,
  },
};

const invalidHeaderType: ValidRequest = {
  ...validRequest,
  headers: {
    // this should be a string
    headerField: 1,
  },
};

/*
 * Try to create schema with missing fields
 */

const missingQuerySchema = z.object({
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const missingParamsSchema = z.object({
  query: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const missingBodySchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const missingHeadersSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

/*
 * Try to create schema with invalid types
 */

const invalidQueryTypeSchema = z.object({
  query: z.object({
    name: z.array(z.string()),
  }),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const invalidParamsTypeSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: z.object({
    name: z.array(z.string()),
  }),
  body: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const invalidBodyTypeSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: z.array(z.string()),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const invalidHeaderTypeSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: z.array(z.string()),
}) satisfies AbstractRequestSchema;

// @expected-compiler-errors-start
// (47,3): error TS2322: Type 'undefined' is not assignable to type '{ name: string; }'.
// (52,3): error TS2322: Type 'undefined' is not assignable to type 'Record<string, never>'.
// (57,3): error TS2322: Type 'undefined' is not assignable to type '{ bodyField: string; }'.
// (62,3): error TS2322: Type 'undefined' is not assignable to type '{ headerField: string; }'.
// (72,5): error TS2353: Object literal may only specify known properties, and 'notAValidQueryKey' does not exist in type '{ name: string; }'.
// (79,5): error TS2353: Object literal may only specify known properties, and 'notAValidBodyKey' does not exist in type '{ bodyField: string; }'.
// (86,5): error TS2353: Object literal may only specify known properties, and 'notAValidHeaderKey' does not exist in type '{ headerField: string; }'.
// (93,5): error TS2322: Type 'string' is not assignable to type 'never'.
// (104,5): error TS2322: Type 'string[]' is not assignable to type 'string'.
// (112,5): error TS2322: Type 'number' is not assignable to type 'string'.
// (120,5): error TS2322: Type 'number' is not assignable to type 'string'.
// (132,4): error TS1360: Type 'ZodObject<{ params: ZodEmptyObject; body: ZodEmptyObject; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { params: Record<string, never>; body: Record<...>; headers: Record<...>; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (138,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; body: ZodEmptyObject; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { query: Record<string, never>; body: Record<...>; headers: Record<...>; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (144,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; params: ZodEmptyObject; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { params: Record<string, never>; query: Record<...>; headers: Record<...>; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (150,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; params: ZodEmptyObject; body: ZodEmptyObject; }, "strip", ZodTypeAny, { params: Record<string, never>; query: Record<...>; body: Record<...>; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (163,4): error TS1360: Type 'ZodObject<{ query: ZodObject<{ name: ZodArray<ZodString, "many">; }, "strip", ZodTypeAny, { name: string[]; }, { name: string[]; }>; params: ZodEmptyObject; body: ZodEmptyObject; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { ...; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (172,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; params: ZodObject<{ name: ZodArray<ZodString, "many">; }, "strip", ZodTypeAny, { name: string[]; }, { name: string[]; }>; body: ZodEmptyObject; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { ...; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (179,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; params: ZodEmptyObject; body: ZodArray<ZodString, "many">; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { ...; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (186,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; params: ZodEmptyObject; body: ZodEmptyObject; headers: ZodArray<ZodString, "many">; }, "strip", ZodTypeAny, { ...; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
