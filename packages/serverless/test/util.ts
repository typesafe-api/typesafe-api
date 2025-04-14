import mockContext from 'aws-lambda-mock-context';
import createEvent from '@serverless/event-mocks';
import { APIGatewayProxyEvent } from 'aws-lambda';

interface MockRequestParams {
  body?: Record<string, unknown>;
  pathParameters?: Record<string, unknown>;
  queryStringParameters?: Record<string, unknown>;
  headers?: Record<string, unknown>;
}

export const mockRequest = (params: MockRequestParams = {}) => {
  const { body = {}, pathParameters = {}, queryStringParameters = {}, headers = {} } = params;
  const event = createEvent('aws:apiGateway', {
    body: JSON.stringify(body),
    pathParameters: pathParameters,
    queryStringParameters,
    headers,
  } as unknown as APIGatewayProxyEvent);
  const context = mockContext();
  return { event, context };
};
