import { createRouteRequest } from '../../src/api-client';
import { CreateDogEndpointDef, GetDogEndpointDef, getDogRoute, postDogRoute } from '../../test/example-routes';

const createDog = createRouteRequest<CreateDogEndpointDef>(this, postDogRoute);
createDog({});
createDog({
  body: {
    name: 'dog',
    breed: 'breed',
    notAValidKey: 'not-a-valid-value',
  },
});

const getDog = createRouteRequest<GetDogEndpointDef>(this, getDogRoute);
getDog({});
getDog({
  params: {
    _id: 'example-id',
    notAValidParam: 'not-a-valid-value',
  },
}).catch((err) => console.log(err));

// @expected-compiler-errors-start
// (5,11): error TS2345: Argument of type '{}' is not assignable to parameter of type 'CreateDogReq'.
// (10,5): error TS2353: Object literal may only specify known properties, and 'notAValidKey' does not exist in type 'Dog'.
// (15,8): error TS2345: Argument of type '{}' is not assignable to parameter of type 'GetDogReq'.
// (19,5): error TS2353: Object literal may only specify known properties, and 'notAValidParam' does not exist in type '{ _id: string; }'.
