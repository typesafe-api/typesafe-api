import middy from '@middy/core';

import { typesafeApi } from '../../src';
import { mockRequest } from '../util';

import type { TypesafeApiEvent, TypesafeApiHandlerResponse } from '../../src';
import type { Handler } from 'aws-lambda';
import type {
  GetDogEndpointDef,
  GetSearchDogsEndpointDef,
  HeaderTestEndpointDef,
} from 'example-api-spec';

it('Successful request using params', async () => {
  const statusCode = 200;
  const name = 'name';
  const breed = 'the breed';
  const handler = async (
    event: TypesafeApiEvent<GetDogEndpointDef>
  ): Promise<TypesafeApiHandlerResponse<GetDogEndpointDef>> => {
    const _id = event.typesafeApi.params._id;
    return {
      statusCode,
      body: {
        _id,
        name,
        breed: breed,
      },
    };
  };

  const middyfied = middy(handler as Handler).use(typesafeApi());

  const _id = 'hello';
  const { event, context } = mockRequest({
    pathParameters: { _id },
  });
  const resp = await middyfied(event, context);
  expect(resp).toEqual({
    statusCode,
    body: JSON.stringify({
      _id,
      name,
      breed,
    }),
  });
});

it('Successful request using query', async () => {
  const statusCode = 200;
  const name = 'Fido';
  const breed = 'the breed';

  const handler = async (
    event: TypesafeApiEvent<GetSearchDogsEndpointDef>
  ): Promise<TypesafeApiHandlerResponse<GetSearchDogsEndpointDef>> => {
    const { searchQuery, breed } = event.typesafeApi.query;

    if (!searchQuery) {
      throw new Error('searchQuery is required');
    }

    if (!breed) {
      throw new Error('breed is required');
    }

    return {
      statusCode,
      body: [
        {
          _id: '1',
          name: searchQuery,
          breed,
        },
      ],
    };
  };

  const middyfied = middy(handler as Handler).use(typesafeApi());

  const { event, context } = mockRequest({
    queryStringParameters: { searchQuery: name, breed },
  });
  const resp = await middyfied(event, context);
  expect(resp).toEqual({
    statusCode,
    body: JSON.stringify([
      {
        _id: '1',
        name,
        breed,
      },
    ]),
  });
});

it('Successful request using headers', async () => {
  const statusCode = 200;
  const headerValue = 'test-header-value';

  const handler = async (
    event: TypesafeApiEvent<HeaderTestEndpointDef>
  ): Promise<TypesafeApiHandlerResponse<HeaderTestEndpointDef>> => {
    const myheader = event.typesafeApi.headers.myheader;

    if (!myheader) {
      throw new Error('myheader is required');
    }

    return {
      statusCode,
      body: {
        headerValue: myheader,
      },
    };
  };

  const middyfied = middy(handler as Handler).use(typesafeApi());

  const { event, context } = mockRequest({
    headers: { MyHeader: headerValue },
  });

  const resp = await middyfied(event, context);
  expect(resp).toEqual({
    statusCode,
    body: JSON.stringify({
      headerValue,
    }),
  });
});
