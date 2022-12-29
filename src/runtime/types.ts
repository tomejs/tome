export interface ApplicationContext {
  $store: { [key: string]: Component };
}

export interface Component {
  new(ctx: ApplicationContext): Component;
  render: () => HTMLElement;
  mount: (root: HTMLElement) => void;
};

export interface TomeApplicationOptions {
  root: HTMLElement;
  component: Component;
  store: { [key: string]: Component };
};

