import { z } from 'zod';
import {
  PartialAbstractRequestSchemaShape,
  Route,
} from '../src';
import { DogSchema, DogWithId } from './dog';
import {
  ApiEndpoint,
  ApiErrorType,
  MyApiDefaultRequestSchema,
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

export const CreateDogReqSchemaShape = {
  body: DogSchema,
} satisfies PartialAbstractRequestSchemaShape;

const CreateDogReqSchema = z.object(CreateDogReqSchemaShape);

export type CreateDogReq = z.infer<typeof CreateDogReqSchema>;

const CreateDogMergedReqSchema = MyApiDefaultRequestSchema.extend({
  body: DogSchema,
});

export type CreateDogMergedReq = z.infer<typeof CreateDogMergedReqSchema>;

export type CreateDogEndpointDef = ApiEndpoint<
  CreateDogReq,
  CreateDogMergedReq,
  DogWithIdRes
>;

export const postDogRoute: Route<CreateDogEndpointDef> = {
  method: 'post',
  path: '/dog',
};

/**
 * Get dogs
 */

export const GetDogsReqSchemaShape = {
  query: z.object({
    breed: z.string().optional(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

const GetDogsReqSchema = z.object(GetDogsReqSchemaShape);
export type GetDogsReq = z.infer<typeof GetDogsReqSchema>;

const GetDogsMergedReqSchema = MyApiDefaultRequestSchema.extend(
  GetDogsReqSchemaShape
);
export type GetDogsMergedReq = z.infer<typeof GetDogsMergedReqSchema>;

export type GetDogsEndpointDef = ApiEndpoint<
  GetDogsReq,
  GetDogsMergedReq,
  DogsWithIdRes
>;

export const getDogsRoute: Route<GetDogsEndpointDef> = {
  method: 'get',
  path: '/dog',
};

/**
 * Search dogs
 */

export const GetSearchDogsReqSchemaShape = {
  query: z.object({
    searchQuery: z.string().optional(),
    breed: z.string().optional(),
  }),
  headers: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
} satisfies PartialAbstractRequestSchemaShape;

const GetSearchDogsReqSchema = z.object(GetSearchDogsReqSchemaShape);

export type GetSearchDogsReq = z.infer<typeof GetSearchDogsReqSchema>;

const GetSearchDogsMergedReqSchema = MyApiDefaultRequestSchema.extend(
  GetSearchDogsReqSchemaShape
);
export type GetSearchDogsMergedReq = z.infer<typeof GetSearchDogsMergedReqSchema>;

export type GetSearchDogsEndpointDef = ApiEndpoint<
  GetSearchDogsReq,
  GetSearchDogsMergedReq,
  DogsWithIdRes
>;

export const getSearchDogsRoute: Route<GetSearchDogsEndpointDef> = {
  method: 'get',
  path: '/dog/search',
};

/**
 * Get dog
 */

const GetDogReqSchemaShape = {
  params: z.object({
    _id: z.string(),
  }),
} satisfies PartialAbstractRequestSchemaShape;

const GetDogReqSchema = z.object(GetDogReqSchemaShape);

export type GetDogReq = z.infer<typeof GetDogReqSchema>;

const GetDogMergedReqSchema = MyApiDefaultRequestSchema.extend(
  GetDogReqSchemaShape
);
export type GetDogMergedReq = z.infer<typeof GetDogMergedReqSchema>;

export type GetDogErrorType = ApiErrorType<500 | 404>;

export type GetDogEndpointDef = ApiEndpoint<
  GetDogReq,
  GetDogMergedReq,
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

const HeaderTestReqSchemaShape = {} satisfies PartialAbstractRequestSchemaShape

const HeaderTestReqSchema = z.object(
  HeaderTestReqSchemaShape
)
export type HeaderTestReq = z.infer<typeof HeaderTestReqSchema>;

const MergedHeaderTestReqSchema = MyApiDefaultRequestSchema.extend(
  HeaderTestReqSchemaShape
)
export type HeaderTestMergedReq = z.infer<typeof MergedHeaderTestReqSchema>;

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
  HeaderTestMergedReq,
  HeaderTestResp
>;

export const headerTestRoute: Route<HeaderTestEndpointDef> = {
  method: 'get',
  path: '/header-tst',
};

/**
 * Internal error test
 */

const InternalErrorTestReqSchemaShape = {} satisfies PartialAbstractRequestSchemaShape;

const InternalErrorTestReqSchema = z.object(InternalErrorTestReqSchemaShape);

export type InternalErrorTestReq = z.infer<typeof InternalErrorTestReqSchema>;

const InternalErrorTestMergedReqSchema = MyApiDefaultRequestSchema.extend(
  InternalErrorTestReqSchemaShape
);
export type InternalErrorTestMergedReq = z.infer<typeof InternalErrorTestMergedReqSchema>;

export type InternalErrorTestEndpointDef = ApiEndpoint<
  InternalErrorTestReq,
  InternalErrorTestMergedReq,
  AbstractResponse
>;

export const internalErrorTestRoute: Route<InternalErrorTestEndpointDef> = {
  method: 'get',
  path: '/internal-error',
};
