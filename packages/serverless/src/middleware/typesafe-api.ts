import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AbstractEndpointDef, serialize } from '@typesafe-api/core';

export interface TypesafeApiEvent<
  T extends AbstractEndpointDef
> extends APIGatewayProxyEvent {
  typesafeApi: {
    query: Exclude<T['requestOptions']['query'], undefined>;
    params: Exclude<T['requestOptions']['params'], undefined>;
    body: Exclude<T['requestOptions']['body'], undefined>;
    headers: Exclude<T['requestOptions']['headers'], undefined>;
  };
}

export const typesafeApi = <T extends AbstractEndpointDef>(): MiddlewareObj<TypesafeApiEvent<T>> => {
  return {
    before: async (request) => {
      const { event } = request;
      const { body, isBase64Encoded } = event;
      const decodeBody = isBase64Encoded && body;
      const data = decodeBody
        ? Buffer.from(body, 'base64').toString()
        : body;

      const query = event.queryStringParameters ?? {};
      const params = event.pathParameters ?? {};
      const parsedBody = JSON.parse(data ?? '{}');
      const headers: any = event.headers ?? {};
      
      event.typesafeApi = {
        query: query as T['requestOptions']['query'],
        params: params as T['requestOptions']['params'],
        body: parsedBody as T['requestOptions']['body'],
        headers: headers as T['requestOptions']['headers'],
      };
    },
    after: async (request) => {
      request.response.body = serialize(request.response.body);
    },
  };
};
