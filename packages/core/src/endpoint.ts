import { z } from 'zod';
import { AbstractErrorType } from './error';
import {
  AbstractRequestSchema,
  PartialAbstractRequestSchema,
} from './types/request-schema';

export type PartialReqModelSchema<T extends PartialAbstractRequestSchema> = {
  model: z.infer<T>;
  schema: T;
};

export type ReqModelSchema<T extends AbstractRequestSchema> = {
  model: z.infer<T>;
  schema: T;
};

export interface EndpointDef<
  TDefaultReq extends ReqModelSchema<AbstractRequestSchema>,
  TReq extends PartialReqModelSchema<PartialAbstractRequestSchema>,
  TMergedReq extends ReqModelSchema<AbstractRequestSchema>,
  TResp,
  E extends AbstractErrorType
> {
  defaultReq: TDefaultReq['model'];
  defaultReqSchema: TDefaultReq['schema'];
  req: TReq['model'];
  reqSchema: TReq['schema'];
  mergedReq: TMergedReq['model'];
  mergedReqSchema: TMergedReq['schema'];
  resp: TResp;
  errorType: E;
}

export type AbstractEndpointDef = EndpointDef<
  any,
  any,
  any,
  any,
  AbstractErrorType
>;

export type ResponseBody<T extends AbstractEndpointDef> = T['resp']['body'];

export type ResponseHeaders<T extends AbstractEndpointDef> =
  T['resp']['headers'];
