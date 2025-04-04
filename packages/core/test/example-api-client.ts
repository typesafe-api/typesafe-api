import {
  CreateDogEndpointDef,
  GetDogEndpointDef,
  getDogRoute,
  GetDogsEndpointDef,
  getDogsRoute,
  HeaderTestEndpointDef,
  headerTestRoute,
  InternalErrorTestEndpointDef,
  internalErrorTestRoute,
  postDogRoute,
} from './example-routes';
import { ApiDefaultReq } from './example-api';
import { AbstractApiClient, ApiClientParams, createRouteRequest } from '../src';
import { AxiosRequestConfig } from 'axios';

class DogApiClient extends AbstractApiClient<ApiDefaultReq> {
  public createDog = createRouteRequest<CreateDogEndpointDef>(
    this,
    postDogRoute
  );
  public getDog = createRouteRequest<GetDogEndpointDef>(this, getDogRoute);
  public getDogs = createRouteRequest<GetDogsEndpointDef>(this, getDogsRoute);
}

export const defaultReqOptions: ApiDefaultReq = {
  headers: {
    myheader: 'default-header-value',
  },
  params: {},
  query: {},
  body: {},
};

export class RootApiClient extends AbstractApiClient<ApiDefaultReq> {
  constructor(params: ApiClientParams<ApiDefaultReq>) {
    super(params);
  }

  public async getDefaultReqOptions(): Promise<ApiDefaultReq> {
    return defaultReqOptions;
  }

  public dog = (): DogApiClient => new DogApiClient(this.getChildParams());

  public headerTest = createRouteRequest<HeaderTestEndpointDef>(
    this,
    headerTestRoute
  );

  public internalErrorTest = createRouteRequest<InternalErrorTestEndpointDef>(
    this,
    internalErrorTestRoute
  );
}
