import {
  ApiEndpointHelper,
  DefaultReqAndSchema,
  EndpointDef,
  EndpointReqModelsAndSchemas,
} from './endpoint';
import { AbstractErrorType, TypesafeHttpError } from './error';
import { AbstractRequestSchema } from './types';
import { AbstractResponse } from './types/response-schema';
import { AbstractProcessedSchemas } from './util';

/*
 * Error types
 */

export interface EasyErrorBody {
  msg: string;
}
export type EasyErrorType<T extends number> = AbstractErrorType<
  T,
  EasyErrorBody
>;
export type AnyEasyErrorType = EasyErrorType<number>;
export type EasyDefaultErrorType<T extends number> = EasyErrorType<T>;

/*
 * Api Endpoint
 */

export type EasyApiEndpointHelper<
  TDefaultReqAndSchema extends DefaultReqAndSchema<AbstractRequestSchema>,
  TProcessedReqSchemas extends AbstractProcessedSchemas,
  TResp extends AbstractResponse,
  E extends AnyEasyErrorType
> = ApiEndpointHelper<TDefaultReqAndSchema, TProcessedReqSchemas, TResp, E>;

export type EasyAnyEndpoint<T extends EasyDefaultErrorType<number>> =
  EndpointDef<
    DefaultReqAndSchema<AbstractRequestSchema>,
    EndpointReqModelsAndSchemas<AbstractProcessedSchemas>,
    AbstractResponse,
    T
  >;

/*
 * Api error class
 */

export class EasyTypesafeHttpError<
  T extends EasyAnyEndpoint<EasyDefaultErrorType<number>>
> extends TypesafeHttpError<T> {
  constructor(statusCode: T['errorType']['statusCode'], msg: string) {
    super({
      statusCode,
      body: {
        msg,
      },
    });
  }
}
