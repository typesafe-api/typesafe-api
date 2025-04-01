import { z } from 'zod';

export const DogSchema = z.object({
  name: z.string(),
  breed: z.string(),
});

export type Dog = z.infer<typeof DogSchema>;

export const DogWithIdSchema = DogSchema.extend({
  _id: z.string(),
});

export type DogWithId = z.infer<typeof DogWithIdSchema>;

export const scoobyDoo: Dog = {
  name: 'Scooby Doo',
  breed: 'Great Dane',
};

// Set up a dummy database
export let dogDB: Map<string, DogWithId>;
export const clearDogDB = (): void => {
  dogDB = new Map<string, DogWithId>();
};
clearDogDB();
