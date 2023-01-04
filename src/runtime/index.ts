import { TomeApplicationOptions, Component  } from './types';
import router from './router';
import events from './events';
import RouterLink from './router_link';
import RouterView from './router_view';

export default function Tome (options: TomeApplicationOptions) {
  const { root, component, store, routes, components = {} } = options;
  const ctx: { [key: string]: any } = {
    $events: events(),
    $components: {
      ...components,
      'router-link': RouterLink,
      'router-view': RouterView
    }
  };

  if(store) {
    ctx.$store = {};
    for(const key in store) {
      ctx.$store[key] = new store[key]();
    }
  }

  if(routes && routes.length) {
    ctx.$routes = routes;
    ctx.$router = router(ctx);
  }

  const componentInstance: Component = new component(ctx);
  componentInstance.mount(root);
}
