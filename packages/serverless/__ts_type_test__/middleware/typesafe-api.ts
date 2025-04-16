import createEvent from '@serverless/event-mocks';

import {
  parseEvent
} from '../../src/lib/middleware/typesafe-api';

import type {
  TypesafeApiEvent} from '../../src/lib/middleware/typesafe-api';
import type { APIGatewayProxyEvent } from 'aws-lambda';
import type { CreateDogEndpointDef } from 'example-api-spec';



const request: CreateDogEndpointDef['mergedReq'] = {
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
parsedEvent.params.invalidParam;

// Invalid query
parsedEvent.query.invalidQuery;

// Valid body
parsedEvent.body.name;

// Invalid body
parsedEvent.body.invalidBody;

// Valid header
parsedEvent.headers.myheader;

// Invalid header
parsedEvent.headers.invalidHeader;

// @expected-compiler-errors-start
// (36,20): error TS2339: Property 'invalidParam' does not exist on type 'never'.
// (39,19): error TS2339: Property 'invalidQuery' does not exist on type 'never'.
// (45,18): error TS2339: Property 'invalidBody' does not exist on type '{ name: string; breed: string; }'.
// (51,21): error TS2339: Property 'invalidHeader' does not exist on type '{ myheader: string; }'.
