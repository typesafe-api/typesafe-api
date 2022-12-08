import { MiddlewareObj } from '@middy/core';
import { APIGatewayProxyEvent } from 'aws-lambda';
import {
  AbstractErrorType,
  serialize,
  TypesafeHttpError,
} from '@typesafe-api/core';

export type HttpErrorLogFn = (httpError: AbstractErrorType) => Promise<void>;

export type OtherErrorLogFn = (err: unknown) => Promise<void>;

export interface TypeSafeApiErrorsParams<T extends AbstractErrorType> {
  httpErrorLogFn?: HttpErrorLogFn;
  otherErrorLogFn?: OtherErrorLogFn;
  internalServerErrorBody: T['body'];
}

const defaultHttpErrorLogFn: HttpErrorLogFn = async (
  httpError: AbstractErrorType
) => {
  console.log(`TypeSafeHttpError - ${JSON.stringify(httpError)}`);
};

const defaultOtherErrorLogFn: OtherErrorLogFn = async (err) => {
  console.log(`Internal server error`, err);
};

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
