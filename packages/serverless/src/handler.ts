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
  return (
    `${absPath.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`
      // Escape square brackets in path
      .replace(/\[/g, '\\[')
      .replace(/]/g, '\\]')
  );
};

export interface SlsCreateFunctionParams {
  route: Route;
  // Relative to serverless project root
  handlerDir: string;
  handlerFile?: string;
  handlerExportName?: string;
}

const dot = '.';

export const slsCreateFunction = (
  params: SlsCreateFunctionParams
): AWS['functions'][string] => {
  const {
    route,
    handlerDir,
    handlerFile = 'handler.ts',
    handlerExportName = 'handler',
  } = params;
  const { path, method } = route;
  const fileNameArray = handlerFile.split(dot);
  // Remove the extension
  fileNameArray.pop();
  const moduleName = fileNameArray.join(dot);
  return {
    handler: `${handlerDir}/${moduleName}.${handlerExportName}`,
    events: [
      {
        http: {
          method: method,
          path: path,
        },
      },
    ],
  };
};
