/* eslint-disable @nrwl/nx/enforce-module-boundaries */
import { typesafeApiErrors } from '../../src/middleware/typesafe-api-errors';
import { MyApiDefaultErrorType } from '../../../core/test/example-api';

typesafeApiErrors<MyApiDefaultErrorType>({
  internalServerErrorBody: {},
});

// @expected-compiler-errors-start
// (6,3): error TS2741: Property 'msg' is missing in type '{}' but required in type 'EasyErrorBody'.
