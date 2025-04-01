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
import { MyDefaultReq } from './example-api';
import { AbstractApiClient, ApiClientParams, createRouteRequest } from '../src';
import { AxiosRequestConfig } from 'axios';

class DogApiClient extends AbstractApiClient<MyDefaultReq> {
  public createDog = createRouteRequest<CreateDogEndpointDef>(
    this,
    postDogRoute
  );
  public getDog = createRouteRequest<GetDogEndpointDef>(this, getDogRoute);
  public getDogs = createRouteRequest<GetDogsEndpointDef>(this, getDogsRoute);
}

export const defaultReqOptions: MyDefaultReq = {
  headers: {
    myheader: 'default-header-value',
  },
  params: {},
  query: {},
  body: {},
};

export class RootApiClient extends AbstractApiClient<MyDefaultReq> {
  constructor(params: ApiClientParams<MyDefaultReq>) {
    super(params);
  }

  public async getDefaultReqOptions(): Promise<MyDefaultReq> {
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
