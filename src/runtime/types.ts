export interface Component {
  new(ctx: { [key: string]: any }): Component;
  render: () => HTMLElement;
  mount: (root: HTMLElement) => void;
};

export interface TomeApplicationOptions {
  root: HTMLElement;
  component: Component;
  store: { [key: string]: any };
  routes: { component: Component, path: string }[];
};

