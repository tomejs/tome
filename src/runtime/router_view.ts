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
    let dynamicComponent: Component = null;
    let $params: { [key: string]: string } = {};
    const dynamicComponentCreate = () => {
      const route = this.$routes.find(
        (route: { path: string, component: Component}) => {
          const pathParts = route.path.split('/').slice(1);
          const routeParts = this.route.split('/').slice(1);
          $params = {};
          console.log(pathParts, routeParts);

          if(pathParts.length !== routeParts.length) return false;

          for(let i = 0; i < pathParts.length; i++) {
            if(pathParts[i].startsWith(':')) {
              $params[pathParts[i].slice(1)] = routeParts[i];
              continue;
            }
            if(pathParts[i] !== routeParts[i]) return false;
          }

          return true;
        }
      );
      if(!route) throw new Error(`Undefined route [${this.route}]`);
      dynamicComponent = new route.component({ ...this.$ctx, $params });
      dynamicComponent.mount(root, anchor);
    }
    dynamicComponentCreate();
    this.$$sub(['route'], () => {
      dynamicComponent.unmount();
      dynamicComponentCreate();
    });
  }
}
