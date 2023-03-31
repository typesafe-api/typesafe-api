import {AWS} from '@serverless/typescript';
import {AbstractEndpointDef} from '@typesafe-api/core';
import {TypesafeApiSeverlessFnc} from '@typesafe-api/serverless';

const dot = '.';

export type SlsAWSFunction = AWS['functions'][string];

export const slsCreateFunction = <T extends AbstractEndpointDef>(
  params: TypesafeApiSeverlessFnc<T>
): SlsAWSFunction => {
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
