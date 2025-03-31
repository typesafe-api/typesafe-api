import { ReqOptions } from '../../src';
import { AbstractApiClient, createRouteRequest } from '../../src/api-client';
import { DefaultReqOpts } from '../../test/example-api';
import { CreateDogEndpointDef, GetDogEndpointDef, getDogRoute, postDogRoute } from '../../test/example-routes';

class TestClient extends AbstractApiClient<DefaultReqOpts> {
  constructor(baseUrl: string) {
    super({ baseUrl });
  }
  public createDog = createRouteRequest<CreateDogEndpointDef>(this, postDogRoute);
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
testClient.getDog({
  params: {
    _id: 'example-id',
    notAValidParam: 'not-a-valid-value',
  },
}).catch((err) => console.log(err));

// @expected-compiler-errors-start
// (16,22): error TS2345: Argument of type '{}' is not assignable to parameter of type 'CreateDogReq'.
// (21,5): error TS2353: Object literal may only specify known properties, and 'notAValidKey' does not exist in type 'Dog'.
// (25,19): error TS2345: Argument of type '{}' is not assignable to parameter of type 'GetDogReq'.
// (29,5): error TS2353: Object literal may only specify known properties, and 'notAValidParam' does not exist in type '{ _id: string; }'.
