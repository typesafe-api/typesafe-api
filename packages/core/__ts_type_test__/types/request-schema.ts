import { z } from 'zod';

import { schemaHelpers } from '../../src';

import type { AbstractRequestSchema } from '../../src';

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

const _missingQuery: ValidRequest = {
  ...validRequest,
  query: undefined,
};

const _missingParams: ValidRequest = {
  ...validRequest,
  params: undefined,
};

const _missingBody: ValidRequest = {
  ...validRequest,
  body: undefined,
};

const _missingHeaders: ValidRequest = {
  ...validRequest,
  headers: undefined,
};

/*
 * Make sure keys are well validated
 */

const _invalidQueryKey: ValidRequest = {
  ...validRequest,
  query: {
    notAValidQueryKey: 'value',
  },
};

const _invalidBodyKey: ValidRequest = {
  ...validRequest,
  body: {
    notAValidBodyKey: 'value',
  },
};

const _invalidHeaderKey: ValidRequest = {
  ...validRequest,
  headers: {
    notAValidHeaderKey: 'value',
  },
};

const _invalidParamsKey: ValidRequest = {
  ...validRequest,
  params: {
    notAValidParamKey: 'value',
  },
};

/*
 * Make sure types are well validated
 */

const _invalidQueryType: ValidRequest = {
  ...validRequest,
  query: {
    name: ['this should be a string'],
  },
};

const _invalidBodyType: ValidRequest = {
  ...validRequest,
  body: {
    // this should be a string
    bodyField: 1,
  },
};

const _invalidHeaderType: ValidRequest = {
  ...validRequest,
  headers: {
    // this should be a string
    headerField: 1,
  },
};

/*
 * Try to create schema with missing fields
 */

const _missingQuerySchema = z.object({
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const _missingParamsSchema = z.object({
  query: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const _missingBodySchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const _missingHeadersSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

/*
 * Try to create schema with invalid types
 */

const _invalidQueryTypeSchema = z.object({
  query: z.object({
    name: z.array(z.string()),
  }),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const _invalidParamsTypeSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: z.object({
    name: z.array(z.string()),
  }),
  body: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const _invalidBodyTypeSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: z.array(z.string()),
  headers: schemaHelpers.emptyObject(),
}) satisfies AbstractRequestSchema;

const _invalidHeaderTypeSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: z.array(z.string()),
}) satisfies AbstractRequestSchema;

// @expected-compiler-errors-start
// (46,3): error TS2322: Type 'undefined' is not assignable to type '{ name: string; }'.
// (51,3): error TS2322: Type 'undefined' is not assignable to type 'Record<string, never>'.
// (56,3): error TS2322: Type 'undefined' is not assignable to type '{ bodyField: string; }'.
// (61,3): error TS2322: Type 'undefined' is not assignable to type '{ headerField: string; }'.
// (71,5): error TS2353: Object literal may only specify known properties, and 'notAValidQueryKey' does not exist in type '{ name: string; }'.
// (78,5): error TS2353: Object literal may only specify known properties, and 'notAValidBodyKey' does not exist in type '{ bodyField: string; }'.
// (85,5): error TS2353: Object literal may only specify known properties, and 'notAValidHeaderKey' does not exist in type '{ headerField: string; }'.
// (92,5): error TS2322: Type 'string' is not assignable to type 'never'.
// (103,5): error TS2322: Type 'string[]' is not assignable to type 'string'.
// (111,5): error TS2322: Type 'number' is not assignable to type 'string'.
// (119,5): error TS2322: Type 'number' is not assignable to type 'string'.
// (131,4): error TS1360: Type 'ZodObject<{ params: ZodEmptyObject; body: ZodEmptyObject; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { params: Record<string, never>; body: Record<...>; headers: Record<...>; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (137,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; body: ZodEmptyObject; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { query: Record<string, never>; body: Record<...>; headers: Record<...>; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (143,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; params: ZodEmptyObject; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { params: Record<string, never>; query: Record<...>; headers: Record<...>; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (149,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; params: ZodEmptyObject; body: ZodEmptyObject; }, "strip", ZodTypeAny, { params: Record<string, never>; query: Record<...>; body: Record<...>; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (162,4): error TS1360: Type 'ZodObject<{ query: ZodObject<{ name: ZodArray<ZodString, "many">; }, "strip", ZodTypeAny, { name: string[]; }, { name: string[]; }>; params: ZodEmptyObject; body: ZodEmptyObject; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { ...; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (171,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; params: ZodObject<{ name: ZodArray<ZodString, "many">; }, "strip", ZodTypeAny, { name: string[]; }, { name: string[]; }>; body: ZodEmptyObject; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { ...; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (178,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; params: ZodEmptyObject; body: ZodArray<ZodString, "many">; headers: ZodEmptyObject; }, "strip", ZodTypeAny, { ...; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
// (185,4): error TS1360: Type 'ZodObject<{ query: ZodEmptyObject; params: ZodEmptyObject; body: ZodEmptyObject; headers: ZodArray<ZodString, "many">; }, "strip", ZodTypeAny, { ...; }, { ...; }>' does not satisfy the expected type 'AbstractRequestSchema'.
