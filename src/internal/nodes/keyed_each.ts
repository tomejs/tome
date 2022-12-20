import { KeyFunction, ListFunction, ListBlockCreationFunction, ListKeyedBlockMap, ListKeyedBlock } from "./types";

export default function keyedEach(listFn: ListFunction, keyFn: KeyFunction, createFn: ListBlockCreationFunction) {
  const anchor = document.createComment('');
  let parentNode: HTMLElement = null;
  let blocks: ListKeyedBlockMap = {};
  let cacheList: any[] = [];
  let cacheIndexByKey: { [key: string]: number} = {};

  function create() {
    const list = listFn();
    list.forEach((item, index) => {
      const key = keyFn(item, index).toString();
      const { nodes, update } = createFn(item, index);
      nodes.forEach(node => node.mount(parentNode, anchor));
      blocks[key] = { nodes, update, index };
      cacheIndexByKey[key] = index;
    });

    cacheList = [...list];
  }

  return {
    root: anchor,
    mount(parent: HTMLElement, _anchor: Comment) {
      parentNode = parent;
      if(_anchor) {
        parent.insertBefore(anchor, _anchor);
      } else {
        parent.append(anchor);
      }
      create();
    },
    unmount() {
      anchor.remove();
      Object.values(blocks).forEach(block => block.nodes.forEach(node => node.unmount()));
      blocks = {};
      cacheList = [];
    },
    update() {
      const list = listFn();
      const indexByKey: { [key: string]: number } = {};
      const newBlocks: { [key: string]: ListKeyedBlock } = {};

      list.forEach((item, index) => indexByKey[keyFn(item, index).toString()] = index);

      for(let i=list.length-1, j=cacheList.length-1; i >= 0 || j >= 0; i--) {
        const newKey = keyFn(list[i], i);
        const oldKey = keyFn(cacheList[j], j);
        const _anchor: Comment | HTMLElement = i < list.length-1 ? newBlocks[keyFn(list[i+1], i+1)].nodes[0].root : anchor;

        if (newKey !== oldKey) {
          if (i === -1) {
            blocks[oldKey].nodes.forEach(node => node.unmount());
            j--;
          } else if(cacheIndexByKey[newKey] === undefined && indexByKey[oldKey] === undefined) {
            if(blocks[oldKey]) {
              blocks[oldKey].nodes.forEach(node => node.unmount());
              const { nodes, update } = createFn(list[i], i);
              nodes.forEach(node => node.mount(parentNode, _anchor));
              newBlocks[newKey] = { nodes, update, index: i };
            }

            j--;
          } else if (cacheIndexByKey[newKey] === undefined || j === -1) {
            const { nodes, update } = createFn(list[i], i);
            nodes.forEach(node => node.mount(parentNode, _anchor));
            newBlocks[newKey] = { nodes, update, index: i };
          } else if (indexByKey[oldKey] === undefined) {
            blocks[oldKey].nodes.forEach(node => node.unmount());
            i++;
            j--;
          } else if(indexByKey[oldKey] !== undefined && cacheIndexByKey[newKey] !== undefined) {
            blocks[newKey].nodes.forEach(node => node.mount(parentNode, _anchor));
            newBlocks[newKey] = blocks[newKey];
            j--;
          }
        } else {
          newBlocks[newKey] = blocks[oldKey];
          j--;
        }
      }

      blocks = { ...newBlocks };
    }
  };
}
