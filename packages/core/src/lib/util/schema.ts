import { z } from 'zod';

import type { PartialAbstractRequestSchemaShape } from '../types/request-schema';
import type { ZodEmptyObject } from '../types/zod';
import type {
  objectUtil,
  UnknownKeysParam,
  ZodRawShape,
  ZodTypeAny,
} from 'zod';

export const schemaHelpers = {
  emptyObject: (): ZodEmptyObject => z.record(z.string(), z.never()),
};

export type ProcessedReqSchemas<
  TReqShape extends ZodRawShape,
  TDefaultSchema extends PartialAbstractRequestSchemaShape
> = {
  reqSchema: z.ZodObject<TReqShape>;
  mergedReqSchema: z.ZodObject<
    objectUtil.extendShape<TDefaultSchema, TReqShape>,
    UnknownKeysParam,
    ZodTypeAny
  >;
};

export type AbstractProcessedSchemas = ProcessedReqSchemas<
  z.ZodRawShape,
  PartialAbstractRequestSchemaShape
>;

export class RequestSchemaProcessor<
  TDefaultSchemaShape extends PartialAbstractRequestSchemaShape
> {
  constructor(private defaultSchemaShape: TDefaultSchemaShape) {}

  processReqShape<TReqShape extends ZodRawShape>(
    reqShape: TReqShape
  ): ProcessedReqSchemas<TReqShape, TDefaultSchemaShape> {
    const reqSchema = z.object(reqShape);
    const mergedReqSchema = z.object(this.defaultSchemaShape).extend(reqShape);
    return {
      reqSchema,
      mergedReqSchema,
    };
  }
}
