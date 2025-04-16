import {
  getDogRoute,
  getDogsRoute,
  headerTestRoute,
  internalErrorTestRoute,
  postDogRoute,
} from 'example-api-spec';
import express from 'express';
import findFreePorts from 'find-free-ports';

import { addRoutes } from '../src';
import {
  createDogController,
  getDogController,
  getDogsController,
  headerTestController,
  internalErrorTestController,
} from './example-controller';
import { typesafeApiErrors } from '../src/lib/middleware/typesafe-api-errors';

import type { ExpressRoute } from '../src';
import type {
  CreateDogEndpointDef,
  GetDogEndpointDef,
  GetDogsEndpointDef,
  HeaderTestEndpointDef,
  InternalErrorTestEndpointDef,
  MyApiDefaultErrorType,
} from 'example-api-spec';
import type { Server } from 'http';

const app = express();

const middleware = [express.json()];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routes: ExpressRoute<any>[] = [];

const ePostDogRoute: ExpressRoute<CreateDogEndpointDef> = {
  ...postDogRoute,
  middleware,
  controller: createDogController,
};
routes.push(ePostDogRoute);

const eGetDogRoute: ExpressRoute<GetDogEndpointDef> = {
  ...getDogRoute,
  middleware,
  controller: getDogController,
};
routes.push(eGetDogRoute);

const eGetDogsRoute: ExpressRoute<GetDogsEndpointDef> = {
  ...getDogsRoute,
  middleware,
  controller: getDogsController,
};
routes.push(eGetDogsRoute);

const eHeaderTestRoute: ExpressRoute<HeaderTestEndpointDef> = {
  ...headerTestRoute,
  middleware,
  controller: headerTestController,
};
routes.push(eHeaderTestRoute);

const eInternalErrorTestRoute: ExpressRoute<InternalErrorTestEndpointDef> = {
  ...internalErrorTestRoute,
  middleware: [],
  controller: internalErrorTestController,
};
routes.push(eInternalErrorTestRoute);

addRoutes(app, routes);

export const internalServerErrorBody: MyApiDefaultErrorType['body'] = {
  msg: 'Internal server error',
};

app.use(
  typesafeApiErrors<MyApiDefaultErrorType>({
    internalServerErrorBody,
  })
);

export const startApp = async (): Promise<{
  server: Server;
  baseUrl: string;
}> => {
  const [port] = await findFreePorts();
  const baseUrl = `http://localhost:${port}`;

  const server = app.listen(port, () => {
    console.log(`Example app listening at ${baseUrl}`);
  });

  return {
    server,
    baseUrl,
  };
};
