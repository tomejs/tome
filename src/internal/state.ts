

const arrayMutationMethods = ['push', 'pop', 'shift', 'unshift', 'splice', 'sort', 'reverse'];

export default function state(obj: Object, cb: () => void): any {
  let shouldUpdate = true;
  const reactive = new Proxy(obj, {
    get(target: {[key: string]: any}, key: any) {
      if (typeof target[key] === "object") {
        return state(target[key], cb);
      } else {
        if(Array.isArray(target) && typeof target[key] === 'function' && arrayMutationMethods.includes(key)) {
          return (...args: any) => {
            shouldUpdate = false;
            const result = target[key](...args);
            cb();
            shouldUpdate = true;
            return result;
          }
        }
        return target[key];
      }
    },
    set(target: { [key: string]: any}, key: any, value) {
      target[key] = value;
      shouldUpdate && cb();
      return true;
    },
  });
  return reactive;
}
