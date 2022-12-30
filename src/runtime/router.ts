
export default function router(ctx: {[key: string]: any}) {
  window.onpopstate = () => {
    ctx.$events.$$pub('route', window.location.pathname);
  };

  return {
    push(path: string) {
      window.history.pushState({}, '', path);
      ctx.$events.$$pub('route', window.location.pathname);
    },

    replace(path: string) {
      window.history.replaceState({}, '', path);
      ctx.$events.$$pub('route', window.location.pathname);
    },

    go(num: number) {
      window.history.go(num);
      ctx.$events.$$pub('route', window.location.pathname);
    },

    back() {
      window.history.back();
      ctx.$events.$$pub('route', window.location.pathname);
    },

    forward() {
      window.history.forward();
      ctx.$events.$$pub('route', window.location.pathname);
    }
  };
}
