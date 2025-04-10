import { APIGatewayProxyEvent } from 'aws-lambda';
import { CreateDogEndpointDef } from '../../../core/test/example-routes';
import {
  parseEvent,
  TypesafeApiEvent,
} from '../../src/middleware/typesafe-api';
import createEvent from '@serverless/event-mocks';

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
// (2,38): error TS2307: Cannot find module '../../../core/test/example-routes' or its corresponding type declarations.
// (6,8): error TS2307: Cannot find module '../../src/middleware/typesafe-api' or its corresponding type declarations.
