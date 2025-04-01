import { z } from 'zod';
import {
  PartialAbstractRequestSchemaShape,
  Route,
  EndpointReqModelsAndSchemas,
} from '../src';
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
const createDogMergedReqSchema = myApiDefaultRequestSchema.extend(
  createDogReqSchemaShape
);

type MsCreateDogReq = EndpointReqModelsAndSchemas<
  typeof createDogReqSchema,
  typeof createDogMergedReqSchema
>;

export type CreateDogEndpointDef = ApiEndpoint<MsCreateDogReq, DogWithIdRes>;

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
const getDogsMergedReqSchema = myApiDefaultRequestSchema.extend(
  getDogsReqSchemaShape
);

type MsGetDogsReq = EndpointReqModelsAndSchemas<
  typeof getDogsReqSchema,
  typeof getDogsMergedReqSchema
>;

export type GetDogsEndpointDef = ApiEndpoint<MsGetDogsReq, DogsWithIdRes>;

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
const getSearchDogsMergedReqSchema = myApiDefaultRequestSchema.extend(
  getSearchDogsReqSchemaShape
);

type MsGetSearchDogsReq = EndpointReqModelsAndSchemas<
  typeof getSearchDogsReqSchema,
  typeof getSearchDogsMergedReqSchema
>;

export type GetSearchDogsEndpointDef = ApiEndpoint<
  MsGetSearchDogsReq,
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
const getDogMergedReqSchema =
  myApiDefaultRequestSchema.extend(getDogReqSchemaShape);

type MsGetDogReq = EndpointReqModelsAndSchemas<
  typeof getDogReqSchema,
  typeof getDogMergedReqSchema
>;

export type GetDogErrorType = ApiErrorType<500 | 404>;

export type GetDogEndpointDef = ApiEndpoint<
  MsGetDogReq,
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
const mergedHeaderTestReqSchema = myApiDefaultRequestSchema.extend(
  headerTestReqSchemaShape
);

type MsHeaderTestReq = EndpointReqModelsAndSchemas<
  typeof headerTestReqSchema,
  typeof mergedHeaderTestReqSchema
>;

export interface HeaderTestResp extends AbstractResponse {
  body: {
    headerValue: string;
  };
  headers: {
    'test-header': string;
  };
}

export type HeaderTestEndpointDef = ApiEndpoint<
  MsHeaderTestReq,
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

const internalErrorTestReqSchemaShape =
  {} satisfies PartialAbstractRequestSchemaShape;

const internalErrorTestReqSchema = z.object(internalErrorTestReqSchemaShape);
const internalErrorTestMergedReqSchema = myApiDefaultRequestSchema.extend(
  internalErrorTestReqSchemaShape
);
type MsInternalErrorTestReq = EndpointReqModelsAndSchemas<
  typeof internalErrorTestReqSchema,
  typeof internalErrorTestMergedReqSchema
>;

export type InternalErrorTestEndpointDef = ApiEndpoint<
  MsInternalErrorTestReq,
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
