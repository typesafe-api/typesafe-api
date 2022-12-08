import { APIGatewayProxyEvent } from 'aws-lambda';
import { Context, Handler } from 'aws-lambda/handler';
import { AWS } from '@serverless/typescript';
import {
  AbstractEndpointDef,
  ReqOptions,
  ResponseBody,
  Route,
  serialize,
} from '@typesafe-api/core';

type ParsedAPIGatewayProxyEvent<T extends ReqOptions> = APIGatewayProxyEvent & {
  typesafeApi: {
    query: T['query'];
    params: T['params'];
    body: T['body'];
    headers: T['headers'];
  };
};

const parseEvent = <T extends ReqOptions>(
  event: APIGatewayProxyEvent
): ParsedAPIGatewayProxyEvent<T> => {
  const { body, isBase64Encoded } = event;
  const data = isBase64Encoded ? Buffer.from(body, 'base64').toString() : body;
  const parsedBody = JSON.parse(data) as T['body'];

  return {
    ...event,
    typesafeApi: {
      query: (event.queryStringParameters ?? {}) as T['query'],
      params: (event.pathParameters ?? {}) as T['params'],
      body: parsedBody,
      headers: (event.headers ?? {}) as T['headers'],
    },
  };
};

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

export type TypesafeApiHandler<T extends AbstractEndpointDef> = (
  event: ParsedAPIGatewayProxyEvent<T['requestOptions']>,
  context: Context
) => TypesafeApiHandlerResponse<T> | Promise<TypesafeApiHandlerResponse<T>>;

export const createHandler = <T extends AbstractEndpointDef>(
  typesafeHandler: TypesafeApiHandler<T>
): Handler => {
  return async (event: APIGatewayProxyEvent, context: Context) => {
    const { statusCode, body } = await typesafeHandler(
      parseEvent(event),
      context
    );
    return {
      statusCode,
      body: serialize(body),
    };
  };
};

export const createError = <T extends AbstractEndpointDef>(
  errorType: T['errorType']
): TypesafeApiHandlerError<T> => {
  return { statusCode: errorType.statusCode, body: errorType };
};

export const relativeToCWD = (absPath: string) => {
  return `${absPath.split(process.cwd())[1].substring(1).replace(/\\/g, '/')}`;
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
