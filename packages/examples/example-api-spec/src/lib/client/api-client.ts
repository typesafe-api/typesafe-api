import { AbstractApiClient, createRouteRequest } from '@typesafe-api/core';

import { headerTestRoute, internalErrorTestRoute } from '../routes';
import { DogApiClient } from './dog-api-client';

import type { MyApiDefaultReq } from '../api';
import type {
  HeaderTestEndpointDef,
  InternalErrorTestEndpointDef,
} from '../routes';
import type { ApiClientParams } from '@typesafe-api/core';

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
