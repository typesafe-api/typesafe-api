import { CreateDogEndpointDef } from '../../core/test/example-routes';
import { Handler } from 'aws-lambda';
import { TypesafeApiEvent } from '../src';

export const reqTest: Handler<TypesafeApiEvent<CreateDogEndpointDef>> = async (
  event,
  context
) => {
  const typesafeApi = event.typesafeApi;

  // Valid header
  typesafeApi.headers.myheader;

  // Invalid header
  typesafeApi.headers.notValidHeader;

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
      breed: 'breed',
    },
  };
};

// @expected-compiler-errors-start
// (15,23): error TS2339: Property 'notValidHeader' does not exist on type '{ myheader: string; }'.
// (18,20): error TS2339: Property 'invalidBody' does not exist on type '{ name: string; breed: string; }'.
// (21,21): error TS2339: Property 'invalidQuery' does not exist on type '{}'.
// (24,22): error TS2339: Property 'invalidParams' does not exist on type '{}'.
