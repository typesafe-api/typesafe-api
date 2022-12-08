import {
  AbstractApiErrorType,
  ApiErrorBody,
  throwHttpError,
} from '../../../core/test/example-api';
import { createHandler, TypesafeApiHandler } from '@typesafe-api/serverless';
import middy from '@middy/core';
import { AbstractEndpointDef } from '@typesafe-api/core';
import { mockRequest } from '../util';
import {
  HttpErrorLogFn,
  OtherErrorLogFn,
  typesafeApiErrors,
} from '../../src/middleware/typesafe-api-errors';

const internalServerErrorBody: ApiErrorBody = {
  msg: 'Default internal server error',
};

it('Internal server error', async () => {
  const statusCode = 500;
  const errMsg = 'A unexpected error';

  const handler: TypesafeApiHandler<AbstractEndpointDef> = async () => {
    throw Error(errMsg);
  };

  const httpErrorLogFn = jest.fn(async () => {});
  const otherErrorLogFn = jest.fn(async (err) =>
    expect(err.message).toBe(errMsg)
  );

  const errHandler = typesafeApiErrors<AbstractApiErrorType>({
    internalServerErrorBody,
    httpErrorLogFn,
    otherErrorLogFn,
  });

  const middyfied = middy(createHandler(handler)).use(errHandler);
  const { event, context } = mockRequest();
  const resp = await middyfied(event, context);
  expect(resp).toEqual({
    statusCode,
    body: JSON.stringify(internalServerErrorBody),
  });

  expect(httpErrorLogFn).toHaveBeenCalledTimes(0);
  expect(otherErrorLogFn).toHaveBeenCalledTimes(1);
});

it('TypesafeHttpError', async () => {
  const statusCode = 404;
  const msg = 'A not found exception';
  const errorBody = {
    msg,
  };

  const handler: TypesafeApiHandler<AbstractEndpointDef> = async () => {
    throw throwHttpError(statusCode, msg);
  };

  const httpErrorLogFn: HttpErrorLogFn = jest.fn(async (httpError) => {
    expect({
      statusCode,
      body: errorBody,
    }).toEqual(httpError);
  });
  const otherErrorLogFn: OtherErrorLogFn = jest.fn(async () => {});

  const errHandler = typesafeApiErrors<AbstractApiErrorType>({
    internalServerErrorBody,
    httpErrorLogFn,
    otherErrorLogFn,
  });

  const middyfied = middy(createHandler(handler)).use(errHandler);
  const { event, context } = mockRequest();
  const resp = await middyfied(event, context);
  expect(resp).toEqual({
    statusCode,
    body: JSON.stringify(errorBody),
  });

  expect(httpErrorLogFn).toHaveBeenCalledTimes(1);
  expect(otherErrorLogFn).toHaveBeenCalledTimes(0);
});
