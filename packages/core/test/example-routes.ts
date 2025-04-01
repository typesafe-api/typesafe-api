import { z } from 'zod';
import { PartialAbstractRequestSchemaShape, Route } from '../src';
import { DogSchema, DogWithId } from './dog';
import {
  ApiEndpoint,
  ApiErrorType,
  myApiDefaultRequestSchema,
} from './example-api';

import { schemaHelpers } from '../src/util/schema';
import { AbstractResponse } from '../src/types/response-schema';

export interface DogWithIdRes extends AbstractResponse {
  body: DogWithId;
}

export interface DogsWithIdRes extends AbstractResponse {
  body: DogWithId[];
}

/**
 * Create dog
 */

export const createDogReqSchemaShape = {
  body: DogSchema,
} satisfies PartialAbstractRequestSchemaShape;

const createDogReqSchema = z.object(createDogReqSchemaShape);
type CreateDogReqSchema = typeof createDogReqSchema;
export type CreateDogReq = z.infer<typeof createDogReqSchema>;

const createDogMergedReqSchema = myApiDefaultRequestSchema.extend({
  body: DogSchema,
});
type CreateDogMergedReqSchema = typeof createDogMergedReqSchema;

export type CreateDogMergedReq = z.infer<typeof createDogMergedReqSchema>;

export type CreateDogEndpointDef = ApiEndpoint<
  CreateDogReq,
  CreateDogReqSchema,
  CreateDogMergedReq,
  CreateDogMergedReqSchema,
  DogWithIdRes
>;

export const postDogRoute: Route<CreateDogEndpointDef> = {
  method: 'post',
  path: '/dog',
  schemas: {
    defaultReqSchema: myApiDefaultRequestSchema,
    reqSchema: createDogReqSchema,
    mergedReqSchema: createDogMergedReqSchema,
  },
};

/**
 * Get dogs
 */

export const getDogsReqSchemaShape = {
  query: z.object({
    breed: z.string().optional(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

const getDogsReqSchema = z.object(getDogsReqSchemaShape);
type GetDogsReqSchema = typeof getDogsReqSchema;
export type GetDogsReq = z.infer<typeof getDogsReqSchema>;

const getDogsMergedReqSchema = myApiDefaultRequestSchema.extend(
  getDogsReqSchemaShape
);
type GetDogsMergedReqSchema = typeof getDogsMergedReqSchema;

export type GetDogsMergedReq = z.infer<typeof getDogsMergedReqSchema>;

export type GetDogsEndpointDef = ApiEndpoint<
  GetDogsReq,
  GetDogsReqSchema,
  GetDogsMergedReq,
  GetDogsMergedReqSchema,
  DogsWithIdRes
>;

export const getDogsRoute: Route<GetDogsEndpointDef> = {
  method: 'get',
  path: '/dog',
  schemas: {
    defaultReqSchema: myApiDefaultRequestSchema,
    reqSchema: getDogsReqSchema,
    mergedReqSchema: getDogsMergedReqSchema,
  },
};

/**
 * Search dogs
 */

export const getSearchDogsReqSchemaShape = {
  query: z.object({
    searchQuery: z.string().optional(),
    breed: z.string().optional(),
  }),
  headers: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
} satisfies PartialAbstractRequestSchemaShape;

const getSearchDogsReqSchema = z.object(getSearchDogsReqSchemaShape);
type GetSearchDogsReqSchema = typeof getSearchDogsReqSchema;
export type GetSearchDogsReq = z.infer<typeof getSearchDogsReqSchema>;

const getSearchDogsMergedReqSchema = myApiDefaultRequestSchema.extend(
  getSearchDogsReqSchemaShape
);
type GetSearchDogsMergedReqSchema = typeof getSearchDogsMergedReqSchema;

export type GetSearchDogsMergedReq = z.infer<typeof getSearchDogsMergedReqSchema>;

export type GetSearchDogsEndpointDef = ApiEndpoint<
  GetSearchDogsReq,
  GetSearchDogsReqSchema,
  GetSearchDogsMergedReq,
  GetSearchDogsMergedReqSchema,
  DogsWithIdRes
>;

export const getSearchDogsRoute: Route<GetSearchDogsEndpointDef> = {
  method: 'get',
  path: '/dog/search',
  schemas: {
    defaultReqSchema: myApiDefaultRequestSchema,
    reqSchema: getSearchDogsReqSchema,
    mergedReqSchema: getSearchDogsMergedReqSchema,
  },
};

/**
 * Get dog
 */

const getDogReqSchemaShape = {
  params: z.object({
    _id: z.string(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

const getDogReqSchema = z.object(getDogReqSchemaShape);
type GetDogReqSchema = typeof getDogReqSchema;
export type GetDogReq = z.infer<typeof getDogReqSchema>;

const getDogMergedReqSchema = myApiDefaultRequestSchema.extend(getDogReqSchemaShape);
type GetDogMergedReqSchema = typeof getDogMergedReqSchema;

export type GetDogMergedReq = z.infer<typeof getDogMergedReqSchema>;

export type GetDogErrorType = ApiErrorType<500 | 404>;

export type GetDogEndpointDef = ApiEndpoint<
  GetDogReq,
  GetDogReqSchema,
  GetDogMergedReq,
  GetDogMergedReqSchema,
  DogWithIdRes,
  GetDogErrorType
>;

export const getDogRoute: Route<GetDogEndpointDef> = {
  method: 'get',
  path: '/dog/:_id',
  schemas: {
    defaultReqSchema: myApiDefaultRequestSchema,
    reqSchema: getDogReqSchema,
    mergedReqSchema: getDogMergedReqSchema,
  },
};

/**
 * Header test
 */

const headerTestReqSchemaShape = {} satisfies PartialAbstractRequestSchemaShape;

const headerTestReqSchema = z.object(headerTestReqSchemaShape);
type HeaderTestReqSchema = typeof headerTestReqSchema;
export type HeaderTestReq = z.infer<typeof headerTestReqSchema>;

const mergedHeaderTestReqSchema = myApiDefaultRequestSchema.extend(
  headerTestReqSchemaShape
);
type HeaderTestMergedReqSchema = typeof mergedHeaderTestReqSchema;

export type HeaderTestMergedReq = z.infer<typeof mergedHeaderTestReqSchema>;

export interface HeaderTestResp extends AbstractResponse {
  body: {
    headerValue: string;
  };
  headers: {
    'test-header': string;
  };
}

export type HeaderTestEndpointDef = ApiEndpoint<
  HeaderTestReq,
  HeaderTestReqSchema,
  HeaderTestMergedReq,
  HeaderTestMergedReqSchema,
  HeaderTestResp
>;

export const headerTestRoute: Route<HeaderTestEndpointDef> = {
  method: 'get',
  path: '/header-tst',
  schemas: {
    defaultReqSchema: myApiDefaultRequestSchema,
    reqSchema: headerTestReqSchema,
    mergedReqSchema: mergedHeaderTestReqSchema,
  },
};

/**
 * Internal error test
 */

const internalErrorTestReqSchemaShape = {} satisfies PartialAbstractRequestSchemaShape;

const internalErrorTestReqSchema = z.object(internalErrorTestReqSchemaShape);
type InternalErrorTestReqSchema = typeof internalErrorTestReqSchema;
export type InternalErrorTestReq = z.infer<typeof internalErrorTestReqSchema>;

const internalErrorTestMergedReqSchema = myApiDefaultRequestSchema.extend(
  internalErrorTestReqSchemaShape
);
type InternalErrorTestMergedReqSchema = typeof internalErrorTestMergedReqSchema;

export type InternalErrorTestMergedReq = z.infer<typeof internalErrorTestMergedReqSchema>;

export type InternalErrorTestEndpointDef = ApiEndpoint<
  InternalErrorTestReq,
  InternalErrorTestReqSchema,
  InternalErrorTestMergedReq,
  InternalErrorTestMergedReqSchema,
  AbstractResponse
>;

export const internalErrorTestRoute: Route<InternalErrorTestEndpointDef> = {
  method: 'get',
  path: '/internal-error',
  schemas: {
    defaultReqSchema: myApiDefaultRequestSchema,
    reqSchema: internalErrorTestReqSchema,
    mergedReqSchema: internalErrorTestMergedReqSchema,
  },
};
