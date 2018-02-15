import { types, getParent, resolveIdentifier, getSnapshot } from 'mobx-state-tree';
import { flatten } from 'lodash';
import { entityShape } from './entity-shape';
import { pageShape } from './list-shape';
import Entity from './entity';

export const Total = types
  .model('Total')
  .props({
    entities: types.maybe(types.number),
    pages: types.maybe(types.number),
  })
  .views(self => ({
    get fetched() {
      return {
        entities: getParent(self).entities.length || null,
        pages: getParent(self).pages.length || null,
      };
    },
  }));

export const Page = types
  .model('Page')
  .props({
    page: types.identifier(types.number),
    fetching: false,
    entities: types.optional(types.array(types.reference(Entity)), []),
  })
  .views(self => ({
    get ready() {
      return self.entities.length > 0;
    },
    get total() {
      return self.entities.length || null;
    },
  }));

const List = types
  .model('List')
  .props({
    mstId: types.identifier(types.string), // latest_post, category_7, movie_34, author_3
    type: types.string,
    id: types.union(types.string, types.number),
    pageMap: types.optional(types.map(Page), {}),
    total: types.optional(Total, {}),
  })
  .views(self => ({
    get ready() {
      return self.pageMap
        .values()
        .map(page => page.ready)
        .reduce((acc, cur) => acc || cur, false);
    },
    get fetching() {
      return self.pageMap
        .values()
        .map(page => page.fetching)
        .reduce((acc, cur) => acc || cur, false);
    },
    get entities() {
      const mstIds = flatten(self.pages.map(page => getSnapshot(page.entities)));
      return mstIds.map(mstId => resolveIdentifier(Entity, self, mstId));
    },
    page(page) {
      return self.pageMap.get(page) || pageShape;
    },
    get pages() {
      return self.pageMap.values();
    },
    get entity() {
      return resolveIdentifier(Entity, self, self.mstId) || entityShape(self.type, self.id)
    },
  }));

export default List;
