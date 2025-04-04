import { objectUtil, UnknownKeysParam, z, ZodRawShape, ZodTypeAny } from 'zod';
import { ZodEmptyObject } from '../types/zod';
import { PartialAbstractRequestSchemaShape } from '../types/request-schema';

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
