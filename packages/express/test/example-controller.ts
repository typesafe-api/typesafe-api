/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { Controller, TRequest, TResponse } from '@typesafe-api/express';
import {
  CreateDogEndpointDef,
  GetDogEndpointDef,
  GetDogsEndpointDef,
  HeaderTestEndpointDef,
  InternalErrorTestEndpointDef,
} from '../../examples/example-api-spec/src/lib/routes/example-routes';
import { MyApiHttpError } from '../../examples/example-api-spec/src/lib/api';
import { dogDB, DogWithId } from '../../examples/example-api-spec/src/lib/dog';
import ObjectID from 'bson-objectid';

export const createDogController: Controller<CreateDogEndpointDef> = async (
  req: TRequest<CreateDogEndpointDef>,
  res: TResponse<CreateDogEndpointDef>
) => {
  const _id = new ObjectID().toHexString();
  const dogWithId: DogWithId = {
    ...req.body,
    _id,
  };
  dogDB.set(_id, dogWithId);
  res.send(dogWithId);
};

export const getDogController: Controller<GetDogEndpointDef> = async (
  req: TRequest<GetDogEndpointDef>,
  res: TResponse<GetDogEndpointDef>
) => {
  const { _id } = req.params;
  if (dogDB.has(_id)) {
    res.send(dogDB.get(_id));
  } else {
    throw new MyApiHttpError(404, `No dog with _id ${_id} could be found`);
  }
};

export const getDogsController: Controller<GetDogsEndpointDef> = async (
  req: TRequest<GetDogsEndpointDef>,
  res: TResponse<GetDogsEndpointDef>
) => {
  res.send(Array.from(dogDB.values()));
};

export const headerTestController: Controller<HeaderTestEndpointDef> = async (
  req: TRequest<HeaderTestEndpointDef>,
  res: TResponse<HeaderTestEndpointDef>
) => {
  const value = req.get('myheader');

  if (!value) {
    throw new Error('No value provided');
  }

  res.set('test-header', value);

  res.send({ headerValue: value });
};

export const internalErrorTestController: Controller<
  InternalErrorTestEndpointDef
> = async (
  req: TRequest<InternalErrorTestEndpointDef>,
  res: TResponse<InternalErrorTestEndpointDef>
) => {
  throw Error('Example error');
};
