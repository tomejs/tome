import { Node, ConditionFunction, NodeCreationFunction } from './types';

export default function ifblock(conditions: ConditionFunction[], createFns: NodeCreationFunction[]) {
  const anchor: Comment = document.createComment('');
  let parentNode: HTMLElement = null;
  let nodes: Node[] = [];
  let currentIndex = -1;

  function update() {
    const index = conditions.findIndex(condition => condition());

    if(index !== currentIndex && index >= 0) {
      currentIndex = index;
      nodes.forEach(node => node.unmount());
      nodes = createFns[index]();
      return true;
    }

    return false;
  }

  function attach() {
    if(parentNode) {
      nodes.forEach(node => node.mount(parentNode, anchor));
    }
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
      update();
      attach();
    },
    unmount() {
      anchor.remove();
      nodes.forEach(node => node.unmount());
    },
    update() {
      update() && attach();
    },
  }
}
