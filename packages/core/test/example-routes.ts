import { ReqOptions, ResOptions, Route } from '../src';
import { Dog, DogWithId } from './dog';
import { ApiEndpoint, ApiErrorType } from './example-api';

export interface DogWithIdRes extends ResOptions {
  body: DogWithId;
}

export interface DogsWithIdRes extends ResOptions {
  body: DogWithId[];
}

// Post dog route
export const postDogRoute: Route = {
  method: 'post',
  path: '/dog',
};

// Create dog endpoint
export interface CreateDogReq extends ReqOptions {
  body: Dog;
}
export type CreateDogEndpointDef = ApiEndpoint<CreateDogReq, DogWithIdRes>;

// Get dogs route
export const getDogsRoute: Route = {
  method: 'get',
  path: '/dog',
};

// Get dogs endpoint
export type GetDogsEndpointDef = ApiEndpoint<ReqOptions, DogsWithIdRes>;

// Get dog route
export const getDogRoute: Route = {
  method: 'get',
  path: '/dog/:_id',
};

// Get dogs endpoint
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

// Header test endpoint
export const headerTestRoute: Route = {
  method: 'get',
  path: '/header-tst',
};

// Header test endpoint
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

// Header test endpoint
export const internalErrorTestRoute: Route = {
  method: 'get',
  path: '/internal-error',
};

export type InternalErrorTestEndpointDef = ApiEndpoint<ReqOptions, ResOptions>;

