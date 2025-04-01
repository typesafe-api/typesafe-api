// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CreateDogEndpointDef } from '../../core/test/example-routes';
import {
  TypesafeApiEvent,
  TypesafeApiHandlerResponse
} from '../src';

export const reqTest = async (
  event: TypesafeApiEvent<CreateDogEndpointDef>
): Promise<TypesafeApiHandlerResponse<CreateDogEndpointDef>> => {
  const typesafeApi = event.typesafeApi;

  // Valid header
  typesafeApi.headers.myheader;

  // Invalid header
  typesafeApi.headers.notValidHeader;

  // Valid body
  typesafeApi.body.name;

  // Invalid body
  typesafeApi.body.invalidBody;

  // Invalid body
  typesafeApi.query.invalidQuery;

  // Invalid params
  typesafeApi.params.invalidParams;

  return {
    statusCode: 200,
    body: {
      _id: 'fake-id',
      name: 'name',
      // Invalid key
      notAValidKey: 1,
      breed: 'breed',
    },
  };
};

// @expected-compiler-errors-start
// (17,23): error TS2339: Property 'notValidHeader' does not exist on type '{ myheader: string; }'.
// (23,20): error TS2339: Property 'invalidBody' does not exist on type '{ name: string; breed: string; }'.
// (26,21): error TS2339: Property 'invalidQuery' does not exist on type 'never'.
// (29,22): error TS2339: Property 'invalidParams' does not exist on type 'never'.
// (37,7): error TS2353: Object literal may only specify known properties, and 'notAValidKey' does not exist in type '{ name: string; breed: string; _id: string; }'.
