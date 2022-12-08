import { Deepmerge } from './type';
import { AxiosRequestConfig } from 'axios';
import { AbstractErrorType } from './error';

/* eslint-disable @typescript-eslint/ban-types */
// We need to use the {} type here or merging default and endpoint request options doesn't work
export interface ReqOptions {
  query?: {};
  params?: {};
  body?: {};
  /**
   * keys should be lowercase
   */
  headers?: {};
  axiosConfig?: AxiosRequestConfig;
}

export interface ResOptions {
  body: {};
  headers: {};
}
/* eslint-enable @typescript-eslint/ban-types */

export interface EndpointDef<
  DefaultReqOpt extends ReqOptions,
  ReqOpt extends ReqOptions,
  ResOpt extends ResOptions,
  E extends AbstractErrorType
> {
  requestOptions: Deepmerge<DefaultReqOpt, ReqOpt>;
  defaultReqOptions: DefaultReqOpt;
  // These are the parameters that will be required by the API client
  clientReqOptions: ReqOpt;
  responseOptions: ResOpt;
  errorType: E;
}

export type AbstractEndpointDef = EndpointDef<any, any, any, AbstractErrorType>;

export type ResponseBody<T extends AbstractEndpointDef> =
  T['responseOptions']['body'];

export type ResponseHeaders<T extends AbstractEndpointDef> =
  T['responseOptions']['headers'];
