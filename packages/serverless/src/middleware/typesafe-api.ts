import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AbstractEndpointDef, serialize } from 'core-old';

type ToExclude = Record<string, never>;

export interface TypesafeApiEvent<T extends AbstractEndpointDef>
  extends APIGatewayProxyEvent {
  typesafeApi: {
    query: Exclude<T['mergedReq']['query'], ToExclude>;
    params: Exclude<T['mergedReq']['params'], ToExclude>;
    body: Exclude<T['mergedReq']['body'], ToExclude>;
    headers: Exclude<T['mergedReq']['headers'], ToExclude>;
  };
}

export const parseEvent = <T extends AbstractEndpointDef>(
  event: APIGatewayProxyEvent
): TypesafeApiEvent<T>['typesafeApi'] => {
  const { body, isBase64Encoded } = event;
  const decodeBody = isBase64Encoded && body;
  const data = decodeBody ? Buffer.from(body, 'base64').toString() : body;

  const query = event.queryStringParameters ?? {};
  const params = event.pathParameters ?? {};
  const parsedBody = JSON.parse(data ?? '{}');
  const headers: any = event.headers ?? {};

  return {
    query: query as T['mergedReq']['query'],
    params: params as T['mergedReq']['params'],
    body: parsedBody as T['mergedReq']['body'],
    headers: headers as T['mergedReq']['headers'],
  };
};

export const typesafeApi = <T extends AbstractEndpointDef>(): MiddlewareObj<
  TypesafeApiEvent<T>
> => {
  return {
    before: async (request) => {
      const { event } = request;
      event.typesafeApi = parseEvent<T>(event);
    },
    after: async (request) => {
      request.response.body = serialize(request.response.body);
    },
  };
};
