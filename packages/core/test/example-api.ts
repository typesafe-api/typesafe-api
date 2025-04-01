import { z } from 'zod';
import {
  EndpointDef,
  ErrorType,
  ResOptions,
  TypesafeHttpError,
} from '../src';
import { AbstractRequest, ZodRequestSchema } from '../src/types/request-schema';
import { schemaHelpers } from '../src/util/schema';

const DefaultRequestSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: z.object({
    myheader: z.string(),
  }),
}) satisfies ZodRequestSchema;

export type DefaultReqOpts = z.infer<typeof DefaultRequestSchema>;

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
      msg,
    },
  });
};

export type DefaultErrorCodes = 500;

export type ApiEndpoint<
  ReqOpt extends AbstractRequest,
  RespOpt extends ResOptions,
  E extends AbstractApiErrorType = ApiErrorType<DefaultErrorCodes>
> = EndpointDef<DefaultReqOpts, ReqOpt, RespOpt, E>;
