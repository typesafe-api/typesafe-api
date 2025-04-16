import type { AbstractEndpointDef } from './endpoint';

/*
 * All API should expect a 400 for validation and a 500 (nothing is perfect).
 */
export type BaseErrorCodes = 400 | 500;

export interface AbstractErrorType<ErrorCodes extends number, Body> {
  statusCode: ErrorCodes;
  body: Body;
}

export type AnyErrorType = AbstractErrorType<number, unknown>;

export abstract class AbstractHttpError<T extends AnyErrorType> extends Error {
  public readonly isTypesafeHttpError = true;
  constructor(public httpError: T) {
    super(JSON.stringify(httpError));
  }
}

export abstract class TypesafeHttpError<
  T extends AbstractEndpointDef
> extends AbstractHttpError<T['errorType']> {}
