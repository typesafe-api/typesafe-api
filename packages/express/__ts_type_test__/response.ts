import type { Controller, TRequest, TResponse } from '../src';
import type { GetDogEndpointDef } from 'example-api-spec';


export const reqTest: Controller<GetDogEndpointDef> = async (
  req: TRequest<GetDogEndpointDef>,
  res: TResponse<GetDogEndpointDef>
) => {
  // Invalid body supplied
  res.send({ somethingElse: 1 });

  // Valid header
  res.set('myheader', 'hi');

  // Invalid header
  res.set('not-a-valid-header', 'hi');
};

// @expected-compiler-errors-start
// (10,14): error TS2353: Object literal may only specify known properties, and 'somethingElse' does not exist in type 'BodyOrError<GetDogEndpointDef>'.
