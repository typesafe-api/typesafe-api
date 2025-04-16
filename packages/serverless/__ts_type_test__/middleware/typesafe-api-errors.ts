import { typesafeApiErrors } from '../../src';

import type { MyApiDefaultErrorType } from 'example-api-spec';


typesafeApiErrors<MyApiDefaultErrorType>({
  internalServerErrorBody: {},
});

// @expected-compiler-errors-start
// (5,3): error TS2741: Property 'msg' is missing in type '{}' but required in type 'EasyErrorBody'.
