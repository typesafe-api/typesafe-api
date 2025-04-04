import { z } from 'zod';
import {
  PartialAbstractRequestSchemaShape,
  Route,
} from '../src';
import { DogSchema, DogWithId } from './dog';
import {
  ApiEndpoint,
  ApiErrorType,
  reqSchemaProcessor,
  routeHelper,
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

const createDogProcessedSchemas = reqSchemaProcessor.processReqShape(
  createDogReqSchemaShape
);

export type CreateDogEndpointDef = ApiEndpoint<
  typeof createDogProcessedSchemas,
  DogWithIdRes
>;

export const postDogRoute: Route<CreateDogEndpointDef> = routeHelper.create({
  path: '/dog',
  method: 'post',
  processedSchemas: createDogProcessedSchemas,
});

/**
 * Get dogs
 */

export const getDogsReqSchemaShape = {
  query: z.object({
    breed: z.string().optional(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

const getDogsProcessedSchemas = reqSchemaProcessor.processReqShape(
  getDogsReqSchemaShape
);
export type GetDogsEndpointDef = ApiEndpoint<
  typeof getDogsProcessedSchemas,
  DogsWithIdRes
>;

export const getDogsRoute: Route<GetDogsEndpointDef> = routeHelper.create({
  method: 'get',
  path: '/dog',
  processedSchemas: getDogsProcessedSchemas,
});

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

const getSearchDogsProcessedSchemas = reqSchemaProcessor.processReqShape(
  getSearchDogsReqSchemaShape
);

export type GetSearchDogsEndpointDef = ApiEndpoint<
  typeof getSearchDogsProcessedSchemas,
  DogsWithIdRes
>;

export const getSearchDogsRoute: Route<GetSearchDogsEndpointDef> = routeHelper.create({
  method: 'get',
  path: '/dog/search',
  processedSchemas: getSearchDogsProcessedSchemas,
});

/**
 * Get dog
 */

const getDogReqSchemaShape = {
  params: z.object({
    _id: z.string(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

const getDogProcessedSchemas = reqSchemaProcessor.processReqShape(
  getDogReqSchemaShape
);

export type GetDogErrorType = ApiErrorType<500 | 404>;

export type GetDogEndpointDef = ApiEndpoint<
  typeof getDogProcessedSchemas,
  DogWithIdRes,
  GetDogErrorType
>;

export const getDogRoute: Route<GetDogEndpointDef> = routeHelper.create({
  method: 'get',
  path: '/dog/:_id',
  processedSchemas: getDogProcessedSchemas,
});

/**
 * Header test
 */

const headerTestReqSchemaShape = {} satisfies PartialAbstractRequestSchemaShape;

const headerTestProcessedSchemas = reqSchemaProcessor.processReqShape(
  headerTestReqSchemaShape
);

export interface HeaderTestResp extends AbstractResponse {
  body: {
    headerValue: string;
  };
  headers: {
    'test-header': string;
  };
}

export type HeaderTestEndpointDef = ApiEndpoint<
  typeof headerTestProcessedSchemas,
  HeaderTestResp
>;

export const headerTestRoute: Route<HeaderTestEndpointDef> = routeHelper.create({
  method: 'get',
  path: '/header-tst',
  processedSchemas: headerTestProcessedSchemas,
});

/**
 * Internal error test
 */

const internalErrorTestReqSchemaShape =
  {} satisfies PartialAbstractRequestSchemaShape;

const internalErrorTestProcessedSchemas = reqSchemaProcessor.processReqShape(
  internalErrorTestReqSchemaShape
);

export type InternalErrorTestEndpointDef = ApiEndpoint<
  typeof internalErrorTestProcessedSchemas,
  AbstractResponse
>;

export const internalErrorTestRoute: Route<InternalErrorTestEndpointDef> = routeHelper.create({
  method: 'get',
  path: '/internal-error',
  processedSchemas: internalErrorTestProcessedSchemas,
});
