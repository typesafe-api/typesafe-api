import { AWS } from '@serverless/typescript';
import { AbstractEndpointDef, ResponseBody, Route } from '@typesafe-api/core';
import { TypesafeApiEvent } from './middleware';
import { Handler } from 'aws-lambda';

export type TypesafeApiHandlerError<T extends AbstractEndpointDef> = {
  statusCode: T['errorType']['statusCode'];
  body: T['errorType'];
};

export type TypesafeApiHandlerSuccess<T extends AbstractEndpointDef> = {
  statusCode: number;
  body: ResponseBody<T>;
};

export type TypesafeApiHandlerResponse<T extends AbstractEndpointDef> =
  | TypesafeApiHandlerSuccess<T>
  | TypesafeApiHandlerError<T>;

export type TypesafeApiHandler<
  EndpointDef extends AbstractEndpointDef,
  EventType extends TypesafeApiEvent<EndpointDef> = TypesafeApiEvent<EndpointDef>
> = Handler<EventType, TypesafeApiHandlerResponse<EndpointDef>>;

export const relativeToCWD = (absPath: string) => {
  return `${absPath.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
};

export interface TypesafeApiSeverlessFnc<T extends AbstractEndpointDef> {
  route: Route<T>;
  // Relative to serverless project root
  handlerDir: string;
  handlerFile?: string;
  handlerExportName?: string;
  imageName?: string;
}

