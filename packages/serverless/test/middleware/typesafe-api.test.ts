import {
  TypesafeApiEvent,
  TypesafeApiHandlerResponse,
  typesafeApi,
} from '../../src';
import middy from '@middy/core';
import { mockRequest } from '../util';
import { GetDogEndpointDef, GetSearchDogsEndpointDef } from 'example-api-spec';
import { Handler } from 'aws-lambda';

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
