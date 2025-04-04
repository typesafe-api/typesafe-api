import { z } from 'zod';
import { AnyErrorType } from './error';
import { AbstractRequestSchema } from './types/request-schema';
import { AbstractProcessedSchemas } from './util/schema';
import { AbstractResponse } from './types/response-schema';

export type DefaultReqAndSchema<T extends AbstractRequestSchema> = {
  req: z.infer<T>;
  schema: T;
};

export type AbstractDefaultReqAndSchema =
  DefaultReqAndSchema<AbstractRequestSchema>;

export type EndpointReqModelsAndSchemas<
  TProcessedReqSchemas extends AbstractProcessedSchemas
> = {
  req: {
    req: z.infer<TProcessedReqSchemas['reqSchema']>;
    schema: TProcessedReqSchemas['reqSchema'];
  };
  mergedReq: {
    req: z.infer<TProcessedReqSchemas['mergedReqSchema']>;
    schema: TProcessedReqSchemas['mergedReqSchema'];
  };
};

export interface EndpointDef<
  TDefaultReq extends DefaultReqAndSchema<AbstractRequestSchema>,
  TEndpointReqModelsAndSchemas extends EndpointReqModelsAndSchemas<AbstractProcessedSchemas>,
  TResp extends AbstractResponse,
  E extends AnyErrorType
> {
  defaultReq: TDefaultReq['req'];
  defaultReqSchema: TDefaultReq['schema'];
  req: TEndpointReqModelsAndSchemas['req']['req'];
  reqSchema: TEndpointReqModelsAndSchemas['req']['schema'];
  mergedReq: TEndpointReqModelsAndSchemas['mergedReq']['req'];
  mergedReqSchema: TEndpointReqModelsAndSchemas['mergedReq']['schema'];
  resp: TResp;
  errorType: E;
}

// This is just a little wrapper around EndpointDef that makes it easier to call when setting up your API
export type ApiEndpointHelper<
  TDefaultReqAndSchema extends DefaultReqAndSchema<AbstractRequestSchema>,
  TProcessedReqSchemas extends AbstractProcessedSchemas,
  TResp extends AbstractResponse,
  E extends AnyErrorType
> = EndpointDef<
  TDefaultReqAndSchema,
  EndpointReqModelsAndSchemas<TProcessedReqSchemas>,
  TResp,
  E
>;

export type AbstractEndpointDef = EndpointDef<any, any, any, AnyErrorType>;

export type ResponseBody<T extends AbstractEndpointDef> = T['resp']['body'];

export type ResponseHeaders<T extends AbstractEndpointDef> =
  T['resp']['headers'];
