import type { AnyErrorType } from '../error';

export type HttpErrorLogFn = (httpError: AnyErrorType) => Promise<void>;

export type OtherErrorLogFn = (err: unknown) => Promise<void>;

export interface TypeSafeApiErrorsParams<T extends AnyErrorType> {
  httpErrorLogFn?: HttpErrorLogFn;
  otherErrorLogFn?: OtherErrorLogFn;
  internalServerErrorBody: T['body'];
}

export const defaultHttpErrorLogFn: HttpErrorLogFn = async (
  httpError: AnyErrorType
) => {
  console.error(`TypeSafeHttpError - ${JSON.stringify(httpError)}`);
};

export const defaultOtherErrorLogFn: OtherErrorLogFn = async (err) => {
  console.error(`Internal server error`, err);
};
