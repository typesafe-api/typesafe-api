import { AbstractApiClient, createRouteRequest } from '../../src/api-client';
import { DefaultReqOpts } from '../../test/example-api';
import {
  CreateDogEndpointDef,
  GetDogEndpointDef,
  getDogRoute,
  postDogRoute,
} from '../../test/example-routes';

class TestClient extends AbstractApiClient<DefaultReqOpts> {
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
// (23,22): error TS2345: Argument of type '{}' is not assignable to parameter of type '{ params: Record<string, never>; query: Record<string, never>; body: { name: string; breed: string; }; headers: Record<string, never>; }'.
// (28,5): error TS2353: Object literal may only specify known properties, and 'notAValidKey' does not exist in type '{ name: string; breed: string; }'.
// (32,19): error TS2345: Argument of type '{}' is not assignable to parameter of type '{ params: { _id: string; }; query: Record<string, never>; body: Record<string, never>; headers: Record<string, never>; }'.
// (37,7): error TS2353: Object literal may only specify known properties, and 'notAValidParam' does not exist in type '{ _id: string; }'.
