export interface ErrorType<S extends number, Body> {
  statusCode: S;
  body: Body;
}

export type AbstractErrorType = ErrorType<number, unknown>;

export abstract class TypesafeHttpError<
  T extends AbstractErrorType
> extends Error {
  public readonly isTypesafeHttpError = true;
  constructor(public httpError: T) {
    super(JSON.stringify(httpError));
  }
}
