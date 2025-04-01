import { z } from 'zod';
import { AbstractErrorType } from './error';
import {
  AbstractRequestSchema,
  PartialAbstractRequestSchema,
} from './types/request-schema';

export type DefaultReqModelSchema<T extends AbstractRequestSchema> = {
  model: z.infer<T>;
  schema: T;
};

export type EndpointReqModelsAndSchemas<
  TReqSchema extends PartialAbstractRequestSchema,
  TMergedReqSchema extends AbstractRequestSchema
> = {
  req: {
    model: z.infer<TReqSchema>;
    schema: TReqSchema;
  };
  mergedReq: {
    model: z.infer<TMergedReqSchema>;
    schema: TMergedReqSchema;
  };
};

export interface EndpointDef<
  TDefaultReq extends DefaultReqModelSchema<AbstractRequestSchema>,
  TEndpointReqModelsAndSchemas extends EndpointReqModelsAndSchemas<
    PartialAbstractRequestSchema,
    AbstractRequestSchema
  >,
  TResp,
  E extends AbstractErrorType
> {
  defaultReq: TDefaultReq['model'];
  defaultReqSchema: TDefaultReq['schema'];
  req: TEndpointReqModelsAndSchemas['req']['model'];
  reqSchema: TEndpointReqModelsAndSchemas['req']['schema'];
  mergedReq: TEndpointReqModelsAndSchemas['mergedReq']['model'];
  mergedReqSchema: TEndpointReqModelsAndSchemas['mergedReq']['schema'];
  resp: TResp;
  errorType: E;
}

export type AbstractEndpointDef = EndpointDef<any, any, any, AbstractErrorType>;

export type ResponseBody<T extends AbstractEndpointDef> = T['resp']['body'];

export type ResponseHeaders<T extends AbstractEndpointDef> =
  T['resp']['headers'];
