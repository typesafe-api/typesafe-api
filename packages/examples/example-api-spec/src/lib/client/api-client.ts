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
  MyApiDefaultReq,
} from 'example-api-spec';
import { AbstractApiClient, ApiClientParams, createRouteRequest } from '@typesafe-api/core';

class DogApiClient extends AbstractApiClient<MyApiDefaultReq> {
  public createDog = createRouteRequest<CreateDogEndpointDef>(
    this,
    postDogRoute
  );
  public getDog = createRouteRequest<GetDogEndpointDef>(this, getDogRoute);
  public getDogs = createRouteRequest<GetDogsEndpointDef>(this, getDogsRoute);
}

export const defaultReqOptions: MyApiDefaultReq = {
  headers: {
    myheader: 'default-header-value',
  },
  params: {},
  query: {},
  body: {},
};

export class RootApiClient extends AbstractApiClient<MyApiDefaultReq> {
  constructor(params: ApiClientParams<MyApiDefaultReq>) {
    super(params);
  }

  public override async getDefaultReqOptions(): Promise<MyApiDefaultReq> {
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
