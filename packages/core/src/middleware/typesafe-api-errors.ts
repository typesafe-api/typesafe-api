import { AbstractErrorType } from '../error';

export type HttpErrorLogFn = (httpError: AbstractErrorType) => Promise<void>;

export type OtherErrorLogFn = (err: unknown) => Promise<void>;

export interface TypeSafeApiErrorsParams<T extends AbstractErrorType> {
  httpErrorLogFn?: HttpErrorLogFn;
  otherErrorLogFn?: OtherErrorLogFn;
  internalServerErrorBody: T['body'];
}

export const defaultHttpErrorLogFn: HttpErrorLogFn = async (
  httpError: AbstractErrorType
) => {
  console.log(`TypeSafeHttpError - ${JSON.stringify(httpError)}`);
};

export const defaultOtherErrorLogFn: OtherErrorLogFn = async (err) => {
  console.log(`Internal server error`, err);
};
