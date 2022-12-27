export default function immutable(obj: any, cb: () => void) {
  return new Proxy(obj, {
    get(target, prop): any {
      if(typeof target[prop] === 'object') {
        return immutable(target[prop], cb);
      } else {
        return target[prop];
      }
    },
    set() {
      cb();
      return false;
    }
  });
}
