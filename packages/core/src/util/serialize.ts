export const serialize = (body: unknown): string => {
  const isString = typeof body === 'string';
  return isString ? body : JSON.stringify(body);
};
