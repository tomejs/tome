import { TomeApplicationOptions, Component } from './types';

export default function Tome (options: TomeApplicationOptions) {
  const { root, component } = options;
  const componentInstance: Component = new component();
  componentInstance.mount(root);
}
