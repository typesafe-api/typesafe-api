import { Controller, TRequest, TResponse } from '@typesafe-api/express';
import { GetDogEndpointDef } from '../../core/test/example-routes';

export const reqTest: Controller<GetDogEndpointDef> = async (
  req: TRequest<GetDogEndpointDef>,
  res: TResponse<GetDogEndpointDef>
) => {
  // Invalid body supplied
  res.send({ somethingElse: 1 });

  // Invalid header
  res.set('myheader', 'hi');
};

// @expected-compiler-errors-start
// (9,14): error TS2353: Object literal may only specify known properties, and 'somethingElse' does not exist in type 'BodyOrError<GetDogEndpointDef>'.
// (12,11): error TS2345: Argument of type 'string' is not assignable to parameter of type 'never'.
