import {
  AbstractErrorType,
  EndpointDef,
  ErrorType,
  ReqOptions,
  ResOptions,
  TypesafeHttpError,
} from '../src';

export interface DefaultReqOpts extends ReqOptions {
  headers: {
    myheader: string;
  };
}

export interface ApiErrorBody {
  msg: string;
}

export type ApiErrorType<S extends number> = ErrorType<S, ApiErrorBody>;

export type AbstractApiErrorType = ApiErrorType<number>;

export class ApiHttpError extends TypesafeHttpError<AbstractApiErrorType> {}

export const throwHttpError = (statusCode: number, msg: string) => {
  throw new ApiHttpError({
    statusCode: statusCode,
    body: {
      msg
    },
  });
};

export type DefaultErrorCodes = 500;

export type ApiEndpoint<
  ReqOpt extends ReqOptions,
  RespOpt extends ResOptions,
  E extends AbstractErrorType = ApiErrorType<DefaultErrorCodes>
> = EndpointDef<DefaultReqOpts, ReqOpt, RespOpt, E>;
