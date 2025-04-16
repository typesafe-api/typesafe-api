import { AbstractApiClient, createRouteRequest } from '@typesafe-api/core';

import {
  getDogRoute,
  getDogsRoute,
  postDogRoute,
  getSearchDogsRoute,
} from '../routes';

import type { MyApiDefaultReq } from '../api';
import type {
  CreateDogEndpointDef,
  GetDogEndpointDef,
  GetDogsEndpointDef,
  GetSearchDogsEndpointDef,
} from '../routes';
import type { TAxiosResponse } from '@typesafe-api/core';

export interface CreateDogParams {
  name: string;
  breed: string;
}

export interface SearchDogsParams {
  searchQuery?: string;
  breed?: string;
}

export class DogApiClient extends AbstractApiClient<MyApiDefaultReq> {
  private _createDog = createRouteRequest<CreateDogEndpointDef>(
    this,
    postDogRoute
  );
  public createDog({
    name,
    breed,
  }: CreateDogParams): Promise<TAxiosResponse<CreateDogEndpointDef>> {
    return this._createDog({
      body: {
        name,
        breed,
      },
    });
  }
  private _getDog = createRouteRequest<GetDogEndpointDef>(this, getDogRoute);
  public getDog(_id: string): Promise<TAxiosResponse<GetDogEndpointDef>> {
    return this._getDog({
      params: { _id },
    });
  }

  private _getDogs = createRouteRequest<GetDogsEndpointDef>(this, getDogsRoute);
  public getDogs(breed?: string): Promise<TAxiosResponse<GetDogsEndpointDef>> {
    return this._getDogs({
      query: {
        breed,
      },
    });
  }

  private _getSearchDogs = createRouteRequest<GetSearchDogsEndpointDef>(
    this,
    getSearchDogsRoute
  );

  public getSearchDogs({
    searchQuery,
    breed,
  }: SearchDogsParams): Promise<TAxiosResponse<GetSearchDogsEndpointDef>> {
    return this._getSearchDogs({
      query: {
        searchQuery,
        breed,
      },
    });
  }
}
