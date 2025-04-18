/* eslint-disable @nx/enforce-module-boundaries */
import { getDogRoute, postDogRoute } from 'example-api-spec';

import { AbstractApiClient, createRouteRequest } from '../../src';

import type {
  CreateDogEndpointDef,
  GetDogEndpointDef,
  MyApiDefaultReq,
} from 'example-api-spec';

class TestClient extends AbstractApiClient<MyApiDefaultReq> {
  constructor(baseUrl: string) {
    super({ baseUrl });
  }
  public createDog = createRouteRequest<CreateDogEndpointDef>(
    this,
    postDogRoute
  );
  public getDog = createRouteRequest<GetDogEndpointDef>(this, getDogRoute);
}

const testClient = new TestClient('https://example.com');

testClient.createDog({});
testClient.createDog({
  body: {
    name: 'dog',
    breed: 'breed',
    notAValidKey: 'not-a-valid-value',
  },
});

testClient.getDog({});
testClient
  .getDog({
    params: {
      _id: 'example-id',
      notAValidParam: 'not-a-valid-value',
    },
  })
  .catch((err) => console.log(err));

// @expected-compiler-errors-start
// (25,22): error TS2345: Argument of type '{}' is not assignable to parameter of type '{ body: { name: string; breed: string; }; }'.
// (30,5): error TS2353: Object literal may only specify known properties, and 'notAValidKey' does not exist in type '{ name: string; breed: string; }'.
// (34,19): error TS2345: Argument of type '{}' is not assignable to parameter of type '{ params: { _id: string; }; }'.
// (39,7): error TS2353: Object literal may only specify known properties, and 'notAValidParam' does not exist in type '{ _id: string; }'.
