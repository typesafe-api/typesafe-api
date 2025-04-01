// import {
//   PartialZodRequestSchemaShape,
//   TypesafeApi,
//   BaseRequestSchemaShape,
// } from '../src';

// import { z } from 'zod';
// import { schemaHelpers } from '../src/util/schema';
// import { ZodRequestSchema } from '../src';
// import { BaseResponseSchemaShape } from '../src/types/response-schema';

// export const DefaultRequestSchema = z.object({
//   query: schemaHelpers.emptyObject(),
//   params: schemaHelpers.emptyObject(),
//   body: schemaHelpers.emptyObject(),
//   headers: z.object({
//     myheader: z.string(),
//   }),
// }) satisfies ZodRequestSchema;

// const requestShape = {
//   query: z.object({
//     myquery: z.string(),
//   }),
//   headers: z.object({
//     newheader: z.string(),
//   }),
// } satisfies PartialZodRequestSchemaShape;

// const MergedRequestSchema = DefaultRequestSchema.extend(requestShape);

// @expected-compiler-errors-start
