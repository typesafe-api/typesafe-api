export const serialize = (body: string) => {
  const isString = typeof body === 'string';
  return isString ? body : JSON.stringify(body);
};
