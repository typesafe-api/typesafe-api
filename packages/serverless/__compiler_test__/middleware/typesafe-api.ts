import { APIGatewayProxyEvent } from 'aws-lambda';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import {
  CreateDogEndpointDef,
} from '../../../core/test/example-routes';
import {
  parseEvent,
  TypesafeApiEvent,
} from '../../src/middleware/typesafe-api';
import createEvent from '@serverless/event-mocks';

const request: CreateDogEndpointDef["mergedReq"] = {
  params: {},
  query: {},
  body: {
    name: 'name of the dog',
    breed: 'breed of the dog',
  },
  headers: {
    myheader: 'myheader',
  },
};

const event = createEvent('aws:apiGateway', {
  body: JSON.stringify(request.body),
  headers: request.headers,
  isBase64Encoded: false,
} as Partial<APIGatewayProxyEvent> as APIGatewayProxyEvent);

const parsedEvent: TypesafeApiEvent<CreateDogEndpointDef>['typesafeApi'] =
  parseEvent<CreateDogEndpointDef>(event);

// Invalid params
parsedEvent.params.invalidParam

// Invalid query
parsedEvent.query.invalidQuery

// Valid body
parsedEvent.body.name

// Invalid body
parsedEvent.body.invalidBody

// Valid header
parsedEvent.headers.myheader

// Invalid header
parsedEvent.headers.invalidHeader

// @expected-compiler-errors-start
// (34,20): error TS2339: Property 'invalidParam' does not exist on type 'never'.
// (37,19): error TS2339: Property 'invalidQuery' does not exist on type 'never'.
// (43,18): error TS2339: Property 'invalidBody' does not exist on type '{ name: string; breed: string; }'.
// (49,21): error TS2339: Property 'invalidHeader' does not exist on type '{ myheader: string; }'.
