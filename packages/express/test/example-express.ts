import express from 'express';
import findFreePorts from 'find-free-ports';
import { addRoutes, ExpressRoute } from '@typesafe-api/express';
import {
  CreateDogEndpointDef,
  GetDogEndpointDef,
  getDogRoute,
  GetDogsEndpointDef,
  getDogsRoute,
  HeaderTestEndpointDef,
  headerTestRoute,
  InternalErrorTestEndpointDef,
  internalErrorTestRoute,
  postDogRoute,
} from '../../core/test/example-routes';
import {
  createDogController,
  getDogController,
  getDogsController,
  headerTestController,
  internalErrorTestController,
} from './example-controller';
import { typesafeApiErrors } from '../src/middleware';
import {
  AbstractApiErrorType,
  ApiErrorBody,
} from '../../core/test/example-api';

const app = express();

const middleware = [express.json()];

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

export const internalServerErrorBody: ApiErrorBody = {
  msg: 'Internal server error',
};

app.use(
  typesafeApiErrors<AbstractApiErrorType>({
    internalServerErrorBody,
  })
);

export const startApp = async (): Promise<{ server: any; baseUrl: string }> => {
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
