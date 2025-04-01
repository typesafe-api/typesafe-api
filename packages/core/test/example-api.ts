import { z } from 'zod';
import { EndpointDef, ErrorType, TypesafeHttpError } from '../src';
import { AbstractRequest, AbstractRequestSchema, PartialAbstractRequestSchema } from '../src/types/request-schema';
import { AbstractResponseSchema } from '../src/types/response-schema';
import { schemaHelpers } from '../src/util/schema';

export const myApiDefaultRequestSchema = z.object({
  query: schemaHelpers.emptyObject(),
  params: schemaHelpers.emptyObject(),
  body: schemaHelpers.emptyObject(),
  headers: z.object({
    myheader: z.string(),
  }),
}) satisfies AbstractRequestSchema;

export type MyApiDefaultRequestSchema = typeof myApiDefaultRequestSchema;

export type MyApiDefaultRequest = z.infer<typeof myApiDefaultRequestSchema>;

export type MyApiRequest = Partial<MyApiDefaultRequest>;

export const MyApiDefaultResponseSchema = z.object({
  body: schemaHelpers.emptyObject(),
  headers: z.object({
    respheader: z.string(),
  }),
}) satisfies AbstractResponseSchema;

export type MyApiResponse = z.infer<typeof MyApiDefaultResponseSchema>;

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
  TReq extends Partial<AbstractRequest>,
  TReqSchema extends PartialAbstractRequestSchema,
  TMergedReq extends AbstractRequest, 
  TMergedReqSchema extends AbstractRequestSchema,
  TResp,
  E extends AbstractApiErrorType = ApiErrorType<DefaultErrorCodes>
> = EndpointDef<MyApiDefaultRequest, MyApiDefaultRequestSchema, TReq, TReqSchema, TMergedReq, TMergedReqSchema, TResp, E>;
