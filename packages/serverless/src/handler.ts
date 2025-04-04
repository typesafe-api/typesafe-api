import { AwsArn, AwsCfInstruction } from '@serverless/typescript';
import { AbstractEndpointDef, ResponseBody, Route } from 'core-old';

export type TypesafeApiHandlerResponse<T extends AbstractEndpointDef> = {
  statusCode: number;
  body: ResponseBody<T>;
};

export type AwsFunction = {
  handler?: string;
  image?: { name: string; command: string[] };
  events?: Array<{
    httpApi: {
      method: string;
      path: string;
      authorizer?: AwsAuthorizer;
      cors?: AwsCors;
    };
  }>;
};

export type AwsAuthorizer =
  | string
  | {
      arn?: AwsArn;
      authorizerId?: AwsCfInstruction;
      claims?: string[];
      identitySource?: string;
      identityValidationExpression?: string;
      managedExternally?: boolean;
      name?: string;
      resultTtlInSeconds?: number;
      scopes?: string[];
      type?: string | string | string | string | string;
    };

export type AwsCors =
  | boolean
  | {
      allowCredentials?: boolean;
      cacheControl?: string;
      headers?: string[];
      maxAge?: number;
      methods?: (
        | 'GET'
        | 'POST'
        | 'PUT'
        | 'PATCH'
        | 'OPTIONS'
        | 'HEAD'
        | 'DELETE'
        | 'ANY'
      )[];
      origin?: string;
      origins?: string[];
    };

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
  authorizer?: AwsAuthorizer;
  cors?: AwsCors;
}

const dot = '.';

export const slsCreateFunction = <T extends AbstractEndpointDef>(
  params: SlsCreateFunctionParams<T>
): AwsFunction => {
  const {
    route,
    handlerDir,
    handlerFile = 'handler.ts',
    handlerExportName = 'handler',
    imageName,
    authorizer,
    cors,
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

  // Create the events array
  const events = [];
  if (path && method) {
    events.push({
      httpApi: {
        method: method,
        path: path,
        authorizer,
        cors,
      },
    });
  }

  return {
    handler,
    image,
    events,
  };
};
