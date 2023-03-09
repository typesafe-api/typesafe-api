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

export interface SlsCreateFunctionParams<T extends AbstractEndpointDef> {
  route: Route<T>;
  // Relative to serverless project root
  handlerDir: string;
  handlerFile?: string;
  handlerExportName?: string;
  imageName?: string;
}

const dot = '.';

export const slsCreateFunction = <T extends AbstractEndpointDef>(
  params: SlsCreateFunctionParams<T>
): AWS['functions'][string] => {
  const {
    route,
    handlerDir,
    handlerFile = 'handler.ts',
    handlerExportName = 'handler',
    imageName,
  } = params;
  const { path, method } = route;
  const fileNameArray = handlerFile.split(dot);
  // Remove the extension
  fileNameArray.pop();
  const moduleName = fileNameArray.join(dot);
  const handlerPath = `${handlerDir}/${moduleName}.${handlerExportName}`;

  // Defined either handler or image depending on if a docker image
  // has been specified
  const handler = imageName ? undefined : handlerPath;
  const image = imageName
    ? { name: imageName, command: [handlerPath] }
    : undefined;

  return {
    handler,
    image,
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
