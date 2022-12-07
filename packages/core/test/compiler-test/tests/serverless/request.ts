import { TypesafeApiHandler } from '../../../../../serverless/src';
import { CreateDogEndpointDef } from '../../../example-routes';

export const reqTest: TypesafeApiHandler<CreateDogEndpointDef> = async (
  event,
  context
) => {
  const typesafeApi = event.typesafeApi;

  // Valid header
  typesafeApi.headers.myheader;

  // Invalid header
  typesafeApi.headers.notValidHeader;

  // Invalid body
  typesafeApi.body.invalidBody

  // Invalid body
  typesafeApi.query.invalidQuery

  // Invalid params
  typesafeApi.params.invalidParams

  return {
    statusCode: 200,
    body: {
      _id: 'fake-id',
      name: 'name',
      breed: 'breed',
    },
  };
};

// @expected-compiler-errors-start
// (14,23): error TS2339: Property 'notValidHeader' does not exist on type '{ myheader: string; }'.
// (17,20): error TS2339: Property 'invalidBody' does not exist on type 'Dog'.
// (20,21): error TS2339: Property 'invalidQuery' does not exist on type '{}'.
// (23,22): error TS2339: Property 'invalidParams' does not exist on type '{}'.
