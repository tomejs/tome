import { ListBlock, ListFunction, ListBlockCreationFunction } from "./types";

export default function each(listFn: ListFunction, createFn: ListBlockCreationFunction) {
  const anchor = document.createComment('');
  let parentNode: HTMLElement = null;
  let blocks: ListBlock[] = [];
  let cache: any[] = [];

  return {
    root: anchor,
    mount(parent: HTMLElement, _anchor: Comment) {
      parentNode = parent;
      if(_anchor) {
        parent.insertBefore(anchor, _anchor);
      } else {
        parent.append(anchor);
      }

      const list = listFn();
      blocks = list.map((item, index) => {
        const { nodes, update } = createFn(item, index);
        nodes.forEach(node => node.mount(parentNode, anchor));
        return { nodes, update };
      });

      cache = [...list];
    },
    unmount() {
      anchor.remove();
      blocks.forEach(block => block.nodes.forEach(node => node.unmount()));
    },
    update() {
      const list = listFn();
      const diff = list.length - cache.length;

      console.log('update');

      if(diff > 0) {
        for(let i=0; i<diff; i++) {
          const { nodes, update }= createFn(list[cache.length + i], cache.length + i);
          nodes.forEach(node => node.mount(parentNode, anchor));
          blocks.push({ nodes, update });
        }
      } else if(diff < 0) {
        for(let i=0; i<-diff; i++) {
          blocks.pop().nodes.forEach(node => node.unmount());
        }
      }

      for(let i=0; i<list.length; i++) {
        if(list[i] !== cache[i]) {
          blocks[i].update(list[i]);
        }
      }

      cache = [...list];
    },
  }
}
