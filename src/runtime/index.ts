import { TomeApplicationOptions, Component } from './types';

export default function Tome (options: TomeApplicationOptions) {
  const { root, component, store } = options;
  const componentInstance: Component = new component({ $store: store });
  componentInstance.mount(root);
}
