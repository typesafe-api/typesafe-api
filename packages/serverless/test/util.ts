import mockContext from 'aws-lambda-mock-context';
import createEvent from '@serverless/event-mocks';
import { APIGatewayProxyEvent } from 'aws-lambda';

export const mockRequest = () => {
  const event = createEvent('aws:apiGateway', {
    body: '{}',
  } as APIGatewayProxyEvent);
  const context = mockContext();
  return { event, context };
};
