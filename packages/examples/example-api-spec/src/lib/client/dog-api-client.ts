import { AbstractApiClient, createRouteRequest } from '@typesafe-api/core';
import { MyApiDefaultReq } from '../api';
import {
  CreateDogEndpointDef,
  GetDogEndpointDef,
  getDogRoute,
  GetDogsEndpointDef,
  getDogsRoute,
  postDogRoute,
  GetSearchDogsEndpointDef,
  getSearchDogsRoute,
} from '../routes';
import { Dog } from '../dto';

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
  public createDog({ name, breed }: CreateDogParams) {
    return this._createDog({
      body: {
        name,
        breed,
      },
    });
  }
  private _getDog = createRouteRequest<GetDogEndpointDef>(this, getDogRoute);
  public getDog(_id: string) {
    return this._getDog({
      params: { _id },
    });
  }

  private _getDogs = createRouteRequest<GetDogsEndpointDef>(this, getDogsRoute);
  public getDogs(breed?: string) {
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

  public getSearchDogs({ searchQuery, breed }: SearchDogsParams) {
    return this._getSearchDogs({
      query: {
        searchQuery,
        breed,
      },
    });
  }
}
