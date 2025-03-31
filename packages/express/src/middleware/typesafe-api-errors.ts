import 'express-async-errors';
import { NextFunction } from 'express-serve-static-core';
import { Request, Response } from 'express';
import {
  AbstractErrorType,
  defaultHttpErrorLogFn,
  defaultOtherErrorLogFn,
  TypeSafeApiErrorsParams,
  TypesafeHttpError,
} from '@typesafe-api/core';

const sendError = (res: Response, err: AbstractErrorType) =>
  res.status(err.statusCode).json(err.body);

const handleError = async <T extends AbstractErrorType>(
  params: TypeSafeApiErrorsParams<T>,
  err: unknown,
  res: Response
) => {
  const {
    httpErrorLogFn = defaultHttpErrorLogFn,
    otherErrorLogFn = defaultOtherErrorLogFn,
    internalServerErrorBody,
  } = params;
  if (err instanceof TypesafeHttpError) {
    await httpErrorLogFn(err.httpError);
    sendError(res, err.httpError);
    return;
  }

  await otherErrorLogFn(err);
  sendError(res, {
    statusCode: 500,
    body: internalServerErrorBody,
  });
};

export const typesafeApiErrors = <T extends AbstractErrorType>(
  params: TypeSafeApiErrorsParams<T>
) => {
  return (err: unknown, req: Request, res: Response, _: NextFunction) => {
    handleError(params, err, res).catch((handleErr) => {
      console.log('typesafe-api error handling failed', handleErr);
      console.log('The original error was', err);
    });
  };
};
