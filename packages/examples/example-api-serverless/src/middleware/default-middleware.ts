import middy from '@middy/core';
import { typesafeApi, typesafeApiErrors } from '@typesafe-api/serverless';

import type { MiddyfiedHandler } from '@middy/core';
import type { Route } from '@typesafe-api/core';
import type {
  TypesafeApiEvent,
  TypesafeApiHandlerResponse,
} from '@typesafe-api/serverless';
import type { MyApiAnyEndpoint } from 'example-api-spec';

export interface MlApiEvent<T extends MyApiAnyEndpoint>
  extends TypesafeApiEvent<T> {
  mlApi: {
    // Any additional properties can be added here
  };
}

export type MyApiHandler<T extends MyApiAnyEndpoint> = (
  event: MlApiEvent<T>,
  context: Context
) => Promise<TypesafeApiHandlerResponse<T>>;

export const defaultMiddleware = <T extends MyApiAnyEndpoint>(
  handler: MyApiHandler<T>,
  route: Route<T>
): MiddyfiedHandler => {
  return (
    middy(handler)
      // Add the typesafe api middleware, this is responsible for parsing requests
      .use(typesafeApi())
      .use(validation(route))
      // Error handling middleware
      .use(
        typesafeApiErrors({
          // Custom logging functions can be added here, by default console.error will be used
          httpErrorLogFn: undefined,
          otherErrorLogFn: undefined,
          // The default error body that will be returned to users when an unhandled error occurs
          internalServerErrorBody: {
            msg: 'Internal server error',
          },
        })
      )
  );
};
