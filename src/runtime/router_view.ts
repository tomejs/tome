import { Component } from "../internal";

export default class extends Component {
  constructor(props: any) {
    super(props);
    this.$$route = '/';
    this.created();
  }

  get route() {
    return this.$$route;
  }

  set route(value) {
    this.$$route = value;
    this.$$pub('route');
  }

  created() {
    this.route = window.location.pathname;

    this.$events.$$sub('route', (route: string) => {
      this.route = route;
    });
  }

  render(root: HTMLElement, anchor?: HTMLElement) {
    try {
      let dynamicComponent: Component = null;
      const dynamicComponentCreate = () => {
        const route = this.$routes.find(
          (route: { path: string, component: Component}) => route.path === this.route
        );
        if(!route) throw new Error(`Undefined route [${this.route}]`);
        dynamicComponent = new route.component(this.$ctx);
        dynamicComponent.mount(root, anchor);
      }
      dynamicComponentCreate();
      this.$$sub(['route'], () => {
        dynamicComponent.unmount();
        dynamicComponentCreate();
      });
    } catch(e) {
      throw new Error(`Undefined route [${this.route}]`);
    }
  }
}
