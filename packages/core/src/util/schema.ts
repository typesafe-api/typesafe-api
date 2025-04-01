import { z } from 'zod';

export const schemaHelpers = {
  emptyObject: () => z.record(z.string(), z.never()),
};
