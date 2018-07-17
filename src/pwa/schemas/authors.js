import { schema } from 'normalizr';

export const author = new schema.Entity(
  'author',
  {},
  {
    processStrategy(entity) {
      const result = { ...entity };
      result.mst = 'author';
      result.type = 'author';
      return result;
    },
  },
);
export const authors = new schema.Array(author);
