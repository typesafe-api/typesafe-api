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
import { DefaultReqOpts } from './example-api';
import { AbstractApiClient, ApiClientParams, createRouteRequest } from '../src';
import { AxiosRequestConfig } from 'axios';

class DogApiClient extends AbstractApiClient<DefaultReqOpts> {
  public createDog = createRouteRequest<CreateDogEndpointDef>(
    this,
    postDogRoute
  );
  public getDog = createRouteRequest<GetDogEndpointDef>(this, getDogRoute);
  public getDogs = createRouteRequest<GetDogsEndpointDef>(this, getDogsRoute);
}

export const defaultReqOptions: DefaultReqOpts = {
  headers: {
    myheader: 'default-header-value',
  },
};

export class RootApiClient extends AbstractApiClient<DefaultReqOpts> {
  constructor(
    params: ApiClientParams<DefaultReqOpts>,
    private axiosConfig?: AxiosRequestConfig
  ) {
    super(params);
  }

  public async getDefaultReqOptions(): Promise<DefaultReqOpts> {
    return {
      ...defaultReqOptions,
      axiosConfig: this.axiosConfig,
    };
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
