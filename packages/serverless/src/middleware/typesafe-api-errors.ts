import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  AbstractErrorType,
  defaultHttpErrorLogFn,
  defaultOtherErrorLogFn,
  serialize,
  TypeSafeApiErrorsParams,
  TypesafeHttpError,
} from '@typesafe-api/core';

type ServerlessResponseType = { statusCode: number; body: string };

type Request = Parameters<
  MiddlewareObj<APIGatewayProxyEvent, ServerlessResponseType>['onError']
>[0];

const handleError = async <T extends AbstractErrorType>(
  request: Request,
  params: TypeSafeApiErrorsParams<T>
) => {
  const {
    httpErrorLogFn = defaultHttpErrorLogFn,
    otherErrorLogFn = defaultOtherErrorLogFn,
    internalServerErrorBody,
  } = params;

  const { error } = request;
  if (error instanceof TypesafeHttpError) {
    const { httpError } = error;
    await httpErrorLogFn(httpError);
    request.response = {
      statusCode: httpError.statusCode,
      body: serialize(httpError.body),
    };
    return;
  }

  await otherErrorLogFn(error);
  request.response = {
    statusCode: 500,
    body: serialize(internalServerErrorBody),
  };
};

export const typesafeApiErrors = <T extends AbstractErrorType>(
  params: TypeSafeApiErrorsParams<T>
): MiddlewareObj<APIGatewayProxyEvent> => {
  return {
    onError: async (request) => {
      try {
        await handleError(request, params);
      } catch (err) {
        console.log('typesafe-api error handling failed', err);
        console.log('The original error was', request.error);
      }
    },
  };
};
