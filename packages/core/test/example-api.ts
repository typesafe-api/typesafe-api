import { z } from 'zod';
import {
  DefaultReqModelSchema,
  EndpointDef,
  ErrorType,
  TypesafeHttpError,
EndpointReqModelsAndSchemas,
} from '../src';
import {
  AbstractRequestSchema,
  PartialAbstractRequestSchema,
} from '../src/types/request-schema';
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

export type MyReqModelSchema = DefaultReqModelSchema<MyApiDefaultRequestSchema>;

export type ApiEndpoint<
  TEndpointReqModelsAndSchemas extends EndpointReqModelsAndSchemas<
    PartialAbstractRequestSchema,
    AbstractRequestSchema
  >,
  TResp,
  E extends AbstractApiErrorType = ApiErrorType<DefaultErrorCodes>
> = EndpointDef<MyReqModelSchema, TEndpointReqModelsAndSchemas, TResp, E>;
