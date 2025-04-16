import type { Controller, TRequest, TResponse } from '../src';
import type { CreateDogEndpointDef } from 'example-api-spec';


export const reqTest: Controller<CreateDogEndpointDef> = async (
  req: TRequest<CreateDogEndpointDef>,
  _res: TResponse<CreateDogEndpointDef>
) => {
  // Valid header
  req.get('myheader');

  // Invalid valid header
  req.get('not-a-valid-header');

  // Invalid query param
  req.query.badQuery;

  // Valid body
  req.body.name;

  // Invalid body
  req.body.badBody;

  // Invalid param
  req.params.badParam;
};

// @expected-compiler-errors-start
// (13,11): error TS2769: No overload matches this call.
// (16,13): error TS2339: Property 'badQuery' does not exist on type 'never'.
// (22,12): error TS2339: Property 'badBody' does not exist on type '{ name: string; breed: string; }'.
// (25,14): error TS2339: Property 'badParam' does not exist on type 'never'.
