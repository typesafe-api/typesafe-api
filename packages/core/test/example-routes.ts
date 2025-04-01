import { z } from 'zod';
import { ZodRequestSchema, ResOptions, Route } from '../src';
import { DogSchema, DogWithId } from './dog';
import { ApiEndpoint, ApiErrorType } from './example-api';
import { schemaHelpers } from '../src/util/schema';

export interface DogWithIdRes extends ResOptions {
  body: DogWithId;
}

export interface DogsWithIdRes extends ResOptions {
  body: DogWithId[];
}

/**
 * Create dog
 */

export const CreateDogReqSchema = z.object({
  body: DogSchema,
  headers: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  query: schemaHelpers.emptyObject(),
}) satisfies ZodRequestSchema;

export type CreateDogReq = z.infer<typeof CreateDogReqSchema>;

export type CreateDogEndpointDef = ApiEndpoint<CreateDogReq, DogWithIdRes>;

export const postDogRoute: Route<CreateDogEndpointDef> = {
  method: 'post',
  path: '/dog',
};

/**
 * Get dogs
 */

export const GetDogsReqSchema = z.object({
  query: z.object({
    breed: z.string().optional(),
  }),
  headers: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
}) satisfies ZodRequestSchema;

export type GetDogsReq = z.infer<typeof GetDogsReqSchema>;

export type GetDogsEndpointDef = ApiEndpoint<GetDogsReq, DogsWithIdRes>;

export const getDogsRoute: Route<GetDogsEndpointDef> = {
  method: 'get',
  path: '/dog',
};

/**
 * Search dogs
 */

export const GetSearchDogsReqSchema = z.object({
  query: z.object({
    searchQuery: z.string().optional(),
    breed: z.string().optional(),
  }),
  headers: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
}) satisfies ZodRequestSchema;

export type GetSearchDogsReq = z.infer<typeof GetSearchDogsReqSchema>;

export type GetSearchDogsEndpointDef = ApiEndpoint<
  GetSearchDogsReq,
  DogsWithIdRes
>;

export const getSearchDogsRoute: Route<GetSearchDogsEndpointDef> = {
  method: 'get',
  path: '/dog/search',
};

/**
 * Get dog
 */

const GetDogReqSchema = z.object({
  params: z.object({
    _id: z.string(),
  }),
  query: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies ZodRequestSchema;

export type GetDogReq = z.infer<typeof GetDogReqSchema>;

export type GetDogErrorType = ApiErrorType<500 | 404>;

export type GetDogEndpointDef = ApiEndpoint<
  GetDogReq,
  DogWithIdRes,
  GetDogErrorType
>;

export const getDogRoute: Route<GetDogEndpointDef> = {
  method: 'get',
  path: '/dog/:_id',
};

/**
 * Header test
 */

export interface HeaderTestReq {
  headers: {
    myheader?: string;
  };
  query: Record<string, never>;
  params: Record<string, never>;
  body: Record<string, never>;
}

export interface HeaderTestResp extends ResOptions {
  body: {
    headerValue: string;
  };
  headers: {
    'test-header': string;
  };
}

export type HeaderTestEndpointDef = ApiEndpoint<HeaderTestReq, HeaderTestResp>;

export const headerTestRoute: Route<HeaderTestEndpointDef> = {
  method: 'get',
  path: '/header-tst',
};

/**
 * Internal error test
 */

const InternalErrorTestReqSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: schemaHelpers.emptyObject(),
}) satisfies ZodRequestSchema;

export type InternalErrorTestReq = z.infer<typeof InternalErrorTestReqSchema>;

export type InternalErrorTestEndpointDef = ApiEndpoint<
  InternalErrorTestReq,
  ResOptions
>;

export const internalErrorTestRoute: Route<InternalErrorTestEndpointDef> = {
  method: 'get',
  path: '/internal-error',
};
