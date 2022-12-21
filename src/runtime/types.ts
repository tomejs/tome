export interface Component {
  new(): Component;
  render: () => HTMLElement;
  mount: (root: HTMLElement) => void;
};

export interface TomeApplicationOptions {
  root: HTMLElement;
  component: Component;
};

