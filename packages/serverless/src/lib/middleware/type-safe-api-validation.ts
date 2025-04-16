import type { TypesafeApiEvent } from '../../../src';
import type { MiddlewareObj } from '@middy/core';
import type { AbstractEndpointDef, Route } from '@typesafe-api/core';
import type { z } from 'zod';

export type OnValidationError<T extends AbstractEndpointDef> = (
  zodError: z.ZodError<T['mergedReq']>
) => Promise<void> | void;

interface TypesafeApiValidationParams<T extends AbstractEndpointDef> {
  route: Route<T>;
  onError: OnValidationError<T>;
}

export const validate = async <T extends AbstractEndpointDef>(
  params: TypesafeApiValidationParams<T>,
  event: TypesafeApiEvent<T>
): Promise<void> => {
  const { route, onError } = params;

  // Get typesafeApi and make sure it's been init correctly
  const { typesafeApi } = event;
  if (!typesafeApi) {
    throw Error(
      'The typesafeApiValidation(..) middleware should be added after typesafeApi(..) middleware'
    );
  }

  const schema: z.AnyZodObject = route.schemas.mergedReqSchema;
  const result = schema.safeParse(typesafeApi);
  if (!result.success) {
    await onError(result.error);
  }
};

export const typesafeApiValidation = <T extends AbstractEndpointDef>(
  params: TypesafeApiValidationParams<T>
): MiddlewareObj<TypesafeApiEvent<T>> => {
  return {
    before: async (request) => {
      const { event } = request;
      await validate(params, event);
    },
  };
};
