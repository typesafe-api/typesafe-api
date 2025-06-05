import {
  getDogRoute,
  getDogsRoute,
  headerTestRoute,
  internalErrorTestRoute,
  postDogRoute,
} from 'example-api-spec';
import Fastify from 'fastify';
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

import type { FastifyRoute } from '../src';
import type {
  CreateDogEndpointDef,
  GetDogEndpointDef,
  GetDogsEndpointDef,
  HeaderTestEndpointDef,
  InternalErrorTestEndpointDef,
  MyApiDefaultErrorType,
} from 'example-api-spec';
import type { FastifyInstance } from 'fastify';

const app = Fastify();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const routes: FastifyRoute<any>[] = [];

const fPostDogRoute: FastifyRoute<CreateDogEndpointDef> = {
  ...postDogRoute,
  controller: createDogController,
};
routes.push(fPostDogRoute);

const fGetDogRoute: FastifyRoute<GetDogEndpointDef> = {
  ...getDogRoute,
  controller: getDogController,
};
routes.push(fGetDogRoute);

const fGetDogsRoute: FastifyRoute<GetDogsEndpointDef> = {
  ...getDogsRoute,
  controller: getDogsController,
};
routes.push(fGetDogsRoute);

const fHeaderTestRoute: FastifyRoute<HeaderTestEndpointDef> = {
  ...headerTestRoute,
  controller: headerTestController,
};
routes.push(fHeaderTestRoute);

const fInternalErrorTestRoute: FastifyRoute<InternalErrorTestEndpointDef> = {
  ...internalErrorTestRoute,
  controller: internalErrorTestController,
};
routes.push(fInternalErrorTestRoute);

addRoutes(app, routes);

export const internalServerErrorBody: MyApiDefaultErrorType['body'] = {
  msg: 'Internal server error',
};

app.register(
  typesafeApiErrors<MyApiDefaultErrorType>({
    internalServerErrorBody,
  })
);

export const startApp = async (): Promise<{
  server: FastifyInstance;
  baseUrl: string;
}> => {
  const [port] = await findFreePorts();
  const baseUrl = `http://localhost:${port}`;

  await app.listen({ port });

  return {
    server: app,
    baseUrl,
  };
};
