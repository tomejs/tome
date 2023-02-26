import Component from '../component';

export default function mapStore(component: Component, stores: string[]) {
  const $store = component.$store;
  if (!$store) {
    throw new Error('Tome has no stores provided. Please provide a store to the Tome instance.');
  }

  stores.forEach((store) => {
    if (!$store[store]) {
      throw new Error(`Store ${store} does not exist.`);
    }

    $store[store].$$stateProps.forEach((prop) => {
      $store[store].$$sub(prop, (data) => {
        component[`$$${prop}`] = $store[store][prop];
        component.$$pub(prop, data);
      });
      component[`$$${prop}`] = $store[store][prop];
      Object.defineProperty(component, prop, {
        get() {
          return component[`$$${prop}`];
        },
        set() {
          throw new Error(`Cannot set store property ${prop} directly. Use a setter or call store methods instead.`);
        },
      });
    });

    $store[store].$$getters.forEach((getter) => {
      $store[store].$$sub(getter, (data) => {
        component.$$pub(getter, data);
      });

      Object.defineProperty(component, getter, {
        get() {
          return $store[store][getter];
        },
      });
    });

    $store[store].$$methods.forEach((method) => {
      $store[store].$$sub(method, (data) => {
        component.$$pub(method, data);
      });

      component[method] = function(...args: any[]) {
        return $store[store][method].apply($store[store], args);
      };
    });
  });
}
