import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AbstractEndpointDef, serialize } from '@typesafe-api/core';

export interface TypesafeApiEvent<
  T extends AbstractEndpointDef = AbstractEndpointDef
> extends APIGatewayProxyEvent {
  typesafeApi: {
    query: Exclude<T['requestOptions']['query'], Record<string, never>>;
    params: Exclude<T['requestOptions']['params'], Record<string, never>>;
    body: Exclude<T['requestOptions']['body'], Record<string, never>>;
    headers: Exclude<T['requestOptions']['headers'], Record<string, never>>;
  };
}

export const typesafeApi = (): MiddlewareObj<TypesafeApiEvent> => {
  return {
    before: async (request) => {
      const { event } = request;
      const { body, isBase64Encoded } = event;
      const data = isBase64Encoded
        ? Buffer.from(body, 'base64').toString()
        : body;
      const parsedBody = JSON.parse(data ?? '{}');
      event.typesafeApi = {
        query: event.queryStringParameters ?? {},
        params: event.pathParameters ?? {},
        body: parsedBody,
        headers: event.headers ?? {},
      };
    },
    after: async (request) => {
      request.response.body = serialize(request.response.body);
    },
  };
};
