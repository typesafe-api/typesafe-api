import middy from '@middy/core';
import { MyApiHttpError } from 'example-api-spec';

import { typesafeApiErrors } from '../../src';
import { mockRequest } from '../util';

import type { HttpErrorLogFn, OtherErrorLogFn } from '@typesafe-api/core';
import type { Handler } from 'aws-lambda';
import type { MyApiDefaultErrorType } from 'example-api-spec';

const internalServerErrorBody: MyApiDefaultErrorType['body'] = {
  msg: 'Default internal server error',
};

it('Internal server error', async () => {
  const statusCode = 500;
  const errMsg = 'A unexpected error';

  const handler = async (): Promise<void> => {
    throw Error(errMsg);
  };

  const httpErrorLogFn = jest.fn();
  const otherErrorLogFn = jest.fn(async (err) =>
    expect(err.message).toBe(errMsg)
  );

  const errHandler = typesafeApiErrors<MyApiDefaultErrorType>({
    internalServerErrorBody,
    httpErrorLogFn,
    otherErrorLogFn,
  });

  const middyfied = middy(handler as Handler).use(errHandler);
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
  const errorBody: MyApiDefaultErrorType['body'] = {
    msg,
  };

  const handler = async (): Promise<void> => {
    throw new MyApiHttpError(statusCode, msg);
  };

  const httpErrorLogFn: HttpErrorLogFn = jest.fn(async (httpError) => {
    expect({
      statusCode,
      body: errorBody,
    }).toEqual(httpError);
  });
  const otherErrorLogFn: OtherErrorLogFn = jest.fn();

  const errHandler = typesafeApiErrors<MyApiDefaultErrorType>({
    internalServerErrorBody,
    httpErrorLogFn,
    otherErrorLogFn,
  });

  const middyfied = middy(handler as Handler).use(errHandler);
  const { event, context } = mockRequest();
  const resp = await middyfied(event, context);
  expect(resp).toEqual({
    statusCode,
    body: JSON.stringify(errorBody),
  });

  expect(httpErrorLogFn).toHaveBeenCalledTimes(1);
  expect(otherErrorLogFn).toHaveBeenCalledTimes(0);
});
