import { types } from 'mobx-state-tree';
import Column from './column';

const Context = types
  .model('Context')
  .props({
    id: types.identifier(),
    options: types.frozen,
    columns: types.optional(types.array(types.late(() => Column)), []),
    selected: types.reference(types.late(() => Column)),
    infinite: true,
  })
  .actions(self => ({
    afterCreate() {
      const flattened = self.columns.reduce(
        (all, column) => all.concat(column.items.map(e => e)),
        [],
      );
      flattened.forEach((item, index) => {
        item.next = flattened[index + 1] || null;
      });
    },
  }));

export default Context;
