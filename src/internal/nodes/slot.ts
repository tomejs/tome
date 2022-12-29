import { Node, NodeCreationFunction } from './types';

export default function slot(name: string, initialCreationFn?: NodeCreationFunction) {
  const anchor: Comment = document.createComment(`slot:${name}`);
  let parentNode: HTMLElement = null;
  let nodes: Node[] = [];
  let creationFn: NodeCreationFunction = initialCreationFn;

  return {
    root: anchor,
    mount(parent: HTMLElement, _anchor: HTMLElement) {
      parentNode = parent;
      if(_anchor) {
        parent.insertBefore(anchor, _anchor);
      } else {
        parent.append(anchor);
      }
      if(creationFn) {
        nodes = creationFn();
        nodes.forEach(node => node.mount(parent, anchor));
      }
    },
    unmount() {
      anchor.remove();
      nodes.forEach(node => node.unmount());
    },
    setCreationFn(fn: () => Node[]) {
      creationFn = fn;
      if(creationFn) {
        nodes.forEach(node => node.unmount());
        nodes = creationFn();
        if(parentNode) {
          nodes.forEach(node => node.mount(parentNode, anchor));
        }
      }
    }
  };
}
