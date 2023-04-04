import { KeyFunction, ListFunction, ListBlockCreationFunction, ListKeyedBlockMap } from "./types";

export default function keyedEach(listFn: ListFunction, keyFn: KeyFunction, createFn: ListBlockCreationFunction) {
  const anchor = document.createComment('keyedEach');
  let parentNode: HTMLElement = null;
  let blocks: ListKeyedBlockMap = {};
  let cacheList: any[] = [];
  let cacheIndexByKey: { [key: string]: number} = {};
  let list = listFn();

  function create() {
    list.forEach((item, index) => {
      const keyObj = keyFn(item, index);
      if(!keyObj) throw new Error('Key function must return a value');
      const key = keyObj.toString();
      const { nodes, update } = createFn(() => list[index], () => index);
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
      list = listFn();
      const indexByKey: { [key: string]: number } = {};
      const itemByKey: { [key: string]: any } = {};
      const newBlocks: ListKeyedBlockMap = {};

      list.forEach((item, index) => {
        itemByKey[keyFn(item, index)] = item;
        indexByKey[keyFn(item, index)] = index;
      });

      for(let i=list.length-1, j=cacheList.length-1; i >= 0 || j >= 0; i--) {
        const newKey = list[i] ? keyFn(list[i], i) : '';
        const oldKey = cacheList[j] ? keyFn(cacheList[j], j) : '';
        const _anchor = i < list.length-1 ? newBlocks[keyFn(list[i+1], i+1)].nodes[0].root : anchor;

        if (newKey !== oldKey) {
          if(newKey === '') {
            blocks[oldKey].nodes.forEach(node => node.unmount());
            j--;
          } else if(oldKey === '') {
            const { nodes, update } = createFn(() => itemByKey[newKey], () => indexByKey[newKey]);
            nodes.forEach(node => node.mount(parentNode, _anchor));
            newBlocks[newKey] = { nodes, update, index: i };
          } else if(cacheIndexByKey[newKey] === undefined && indexByKey[oldKey] !== undefined) {
            const { nodes, update } = createFn(() => itemByKey[newKey], () => indexByKey[newKey]);
            nodes.forEach(node => node.mount(parentNode, _anchor));
            newBlocks[newKey] = { nodes, update, index: i };
          } else if(cacheIndexByKey[newKey] !== undefined && indexByKey[oldKey] === undefined) {
            blocks[oldKey].nodes.forEach(node => node.unmount());
            blocks[oldKey].update(list[i], i);
            i++;
            j--;
          } else if(cacheIndexByKey[newKey] === undefined && indexByKey[oldKey] === undefined) {
            const { nodes, update } = createFn(() => itemByKey[newKey], () => indexByKey[newKey]);
            nodes.forEach(node => node.mount(parentNode, _anchor));
            newBlocks[newKey] = { nodes, update, index: i };

            blocks[oldKey].nodes.forEach(node => node.unmount());
            j--;
          } else if(cacheIndexByKey[newKey] !== undefined && indexByKey[oldKey] !== undefined) {
            blocks[newKey].nodes.forEach(node => node.mount(parentNode, _anchor));
            newBlocks[newKey] = blocks[newKey];
            j--;
          }
        } else {
          newBlocks[newKey] = blocks[oldKey];
          newBlocks[newKey].update(list[i], i);
          j--;
        }
      }

      cacheIndexByKey = indexByKey;
      cacheList = [...list];
      blocks = { ...newBlocks };
    }
  }
}
