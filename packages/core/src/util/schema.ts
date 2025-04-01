import { z } from 'zod';
import { ZodEmptyObject } from '../types/zod';

export const schemaHelpers = {
  emptyObject: (): ZodEmptyObject => z.record(z.string(), z.never()),
};
