import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AbstractEndpointDef, serialize } from '@typesafe-api/core';

export interface TypesafeApiEvent<T extends AbstractEndpointDef = AbstractEndpointDef>
  extends APIGatewayProxyEvent {
  typesafeApi: {
    query: T['requestOptions']['query'];
    params: T['requestOptions']['params'];
    body: T['requestOptions']['body'];
    headers: T['requestOptions']['headers'];
  };
}

export const typesafeApi = (): MiddlewareObj<APIGatewayProxyEvent> => {
  return {
    before: async (request) => {
      const { event } = request;
      const { body, isBase64Encoded } = event;
      const data = isBase64Encoded
        ? Buffer.from(body, 'base64').toString()
        : body;
      const parsedBody = JSON.parse(data);
      (event as TypesafeApiEvent<AbstractEndpointDef>).typesafeApi = {
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
