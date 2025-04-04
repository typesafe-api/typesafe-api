import { AbstractEndpointDef } from './endpoint';

export type BaseErrorCodes = 400 | 500;

export interface AbstractErrorType<ErrorCodes extends number, Body> {
  statusCode: ErrorCodes;
  body: Body;
}

export type AnyErrorType = AbstractErrorType<number, unknown>

export abstract class AbstractHttpError<T extends AnyErrorType> extends Error{
  public readonly isTypesafeHttpError = true;
  constructor(public httpError: T) {
    super(JSON.stringify(httpError));
  }
}

export abstract class TypesafeHttpError<
  T extends AbstractEndpointDef
> extends AbstractHttpError<T['errorType']> {}