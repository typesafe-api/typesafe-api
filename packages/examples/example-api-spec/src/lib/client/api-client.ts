import {
  HeaderTestEndpointDef,
  headerTestRoute,
  InternalErrorTestEndpointDef,
  internalErrorTestRoute,
  MyApiDefaultReq,
} from 'example-api-spec';
import {
  AbstractApiClient,
  ApiClientParams,
  createRouteRequest,
} from '@typesafe-api/core';
import { DogApiClient } from './dog-api-client';

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

  public dog = () => new DogApiClient(this.getChildParams());

  public headerTest = createRouteRequest<HeaderTestEndpointDef>(
    this,
    headerTestRoute
  );

  public internalErrorTest = createRouteRequest<InternalErrorTestEndpointDef>(
    this,
    internalErrorTestRoute
  );
}
