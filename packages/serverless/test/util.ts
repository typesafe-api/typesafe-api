import mockContext from 'aws-lambda-mock-context';
import createEvent from '@serverless/event-mocks';
import { APIGatewayProxyEvent } from 'aws-lambda';
import { AbstractEndpointDef } from '@typesafe-api/core';

export const mockRequest = <T extends AbstractEndpointDef>(
  body: T['requestOptions'] = {}
) => {
  const event = createEvent('aws:apiGateway', {
    body: JSON.stringify(body),
  } as APIGatewayProxyEvent);
  const context = mockContext();
  return { event, context };
};
