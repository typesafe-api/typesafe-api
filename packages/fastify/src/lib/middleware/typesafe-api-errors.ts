import {
  defaultHttpErrorLogFn,
  defaultOtherErrorLogFn,
  TypesafeHttpError,
} from '@typesafe-api/core';

import type {
  AnyErrorType,
  TypeSafeApiErrorsParams,
} from '@typesafe-api/core';
import type { FastifyReply, FastifyPluginCallback } from 'fastify';

const sendError = (reply: FastifyReply, err: AnyErrorType): void => {
  reply.status(err.statusCode).send(err.body);
};

const handleError = async <T extends AnyErrorType>(
  params: TypeSafeApiErrorsParams<T>,
  err: unknown,
  reply: FastifyReply
): Promise<void> => {
  const {
    httpErrorLogFn = defaultHttpErrorLogFn,
    otherErrorLogFn = defaultOtherErrorLogFn,
    internalServerErrorBody,
  } = params;

  if (err instanceof TypesafeHttpError) {
    await httpErrorLogFn(err.httpError);
    sendError(reply, err.httpError);
    return;
  }

  await otherErrorLogFn(err);
  sendError(reply, {
    statusCode: 500,
    body: internalServerErrorBody,
  });
};

export const typesafeApiErrors = <T extends AnyErrorType>(
  params: TypeSafeApiErrorsParams<T>
): FastifyPluginCallback => {
  return (fastify, _opts, done) => {
    fastify.setErrorHandler((err, _req, reply) => {
      handleError(params, err, reply).catch((handleErr) => {
        console.log('typesafe-api error handling failed', handleErr);
        console.log('The original error was', err);
      });
    });
    done();
  };
};
