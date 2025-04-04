/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { typesafeApiErrors } from '../../src/middleware/typesafe-api-errors';
import { AnyApiErrorType } from '../../../core/test/example-api';

typesafeApiErrors<AnyApiErrorType>({
  internalServerErrorBody: {},
});

// @expected-compiler-errors-start
// (6,3): error TS2741: Property 'errMsg' is missing in type '{}' but required in type 'ApiErrorBody'.
