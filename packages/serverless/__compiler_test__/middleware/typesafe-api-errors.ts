import { typesafeApiErrors } from '../../src/middleware/typesafe-api-errors';
import { AbstractApiErrorType } from '../../../core/test/example-api';

typesafeApiErrors<AbstractApiErrorType>({
  internalServerErrorBody: {},
});

// @expected-compiler-errors-start
// (5,3): error TS2741: Property 'msg' is missing in type '{}' but required in type 'ApiErrorBody'.
