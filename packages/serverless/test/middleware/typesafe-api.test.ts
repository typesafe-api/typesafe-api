import { typesafeApi, TypesafeApiHandler } from '@typesafe-api/serverless';
import middy from '@middy/core';
import { mockRequest } from '../util';
import { GetDogEndpointDef } from '../../../core/test/example-routes';
import { Handler } from 'aws-lambda';

it('Successful request', async () => {
  const statusCode = 200;
  const name = 'name';
  const breed = 'the breed';
  const handler: TypesafeApiHandler<GetDogEndpointDef> = async (event) => {
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
