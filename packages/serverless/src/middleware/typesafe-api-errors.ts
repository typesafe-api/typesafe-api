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
  NonNullable<MiddlewareObj<APIGatewayProxyEvent, ServerlessResponseType>['onError']>
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
  // Duck typing to check if the error is a TypesafeHttpError, seems to work better than instanceof
  if ((error as any).isTypesafeHttpError) {
    const { httpError } = error as TypesafeHttpError<T>;
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
