import { ReqOptions, ResOptions, Route } from '../src';
import { Dog, DogWithId } from './dog';
import { ApiEndpoint, ApiErrorType } from './example-api';

export interface DogWithIdRes extends ResOptions {
  body: DogWithId;
}

export interface DogsWithIdRes extends ResOptions {
  body: DogWithId[];
}

/**
 * Create dog
 */

export interface CreateDogReq extends ReqOptions {
  body: Dog;
}
export type CreateDogEndpointDef = ApiEndpoint<CreateDogReq, DogWithIdRes>;

export const postDogRoute: Route<CreateDogEndpointDef> = {
  method: 'post',
  path: '/dog',
};

/**
 * Get dogs
 */

export interface GetDogsReq extends ReqOptions {
  query: {
    breed?: string;
  };
}

export type GetDogsEndpointDef = ApiEndpoint<GetDogsReq, DogsWithIdRes>;

export const getDogsRoute: Route<GetDogsEndpointDef> = {
  method: 'get',
  path: '/dog',
};

/**
 * Search dogs
 */

export interface GetSearchDogsReq extends ReqOptions {
  query: {
    searchQuery: string;
    breed?: string;
  };
}

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

export interface GetDogReq extends ReqOptions {
  params: {
    _id: string;
  };
}

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

export interface HeaderTestReq extends ReqOptions {
  headers?: {
    myheader?: string;
  };
}

export interface HeaderTestResp extends ResOptions {
  body: {
    headerValue: string;
  };
  headers: {
    'test-header': string;
  };
}

export type HeaderTestEndpointDef = ApiEndpoint<ReqOptions, HeaderTestResp>;

export const headerTestRoute: Route<HeaderTestEndpointDef> = {
  method: 'get',
  path: '/header-tst',
};

/**
 * Internal error test
 */

export type InternalErrorTestEndpointDef = ApiEndpoint<ReqOptions, ResOptions>;

export const internalErrorTestRoute: Route<InternalErrorTestEndpointDef> = {
  method: 'get',
  path: '/internal-error',
};
