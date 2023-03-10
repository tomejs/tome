import { Node, ConditionFunction, NodeCreationFunction } from './types';
import Component from '../component';

export default function ifblock(_parentComponent: Component, conditions: ConditionFunction[], createFns: NodeCreationFunction[]) {
  const anchor: Comment = document.createComment('if');
  const parentComponent = _parentComponent;
  let parentNode: HTMLElement = null;
  let nodes: Node[] = [];
  let subscriptions: any[] = [];
  let currentIndex = -1;

  function update() {
    const index = conditions.findIndex(condition => condition());

    if(index !== currentIndex && index >= 0) {
      currentIndex = index;
      nodes.forEach(node => node.unmount());
      subscriptions.forEach(sub => parentComponent.$$unsub(sub?.name, sub?.fn));
      const { children, subs } = createFns[index]();
      nodes = children;
      subscriptions = subs;
      return true;
    } else if(index === -1 && nodes.length) {
      currentIndex = -1;
      nodes.forEach(node => node.unmount());
      subscriptions.forEach(sub => parentComponent.$$unsub(sub?.name, sub?.fn));
      nodes = [];
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
