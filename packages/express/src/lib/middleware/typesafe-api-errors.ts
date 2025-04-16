import 'express-async-errors';
import {
  defaultHttpErrorLogFn,
  defaultOtherErrorLogFn,
  TypesafeHttpError,
} from '@typesafe-api/core';

import type { AnyErrorType, TypeSafeApiErrorsParams } from '@typesafe-api/core';
import type { Request, Response } from 'express';
import type { NextFunction } from 'express-serve-static-core';

const sendError = (res: Response, err: AnyErrorType): Response =>
  res.status(err.statusCode).json(err.body);

const handleError = async <T extends AnyErrorType>(
  params: TypeSafeApiErrorsParams<T>,
  err: unknown,
  res: Response
): Promise<void> => {
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

export const typesafeApiErrors = <T extends AnyErrorType>(
  params: TypeSafeApiErrorsParams<T>
) => {
  return (err: unknown, req: Request, res: Response, _: NextFunction) => {
    handleError(params, err, res).catch((handleErr) => {
      console.log('typesafe-api error handling failed', handleErr);
      console.log('The original error was', err);
    });
  };
};
