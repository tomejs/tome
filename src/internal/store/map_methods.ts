import Component from "../component";

export default function mapMethods(component: Component, methods: any) {
  const $store = component.$store;
  if (!$store) {
    throw new Error('Tome has no stores provided. Please provide a store to the Tome instance.');
  }

  Object.keys(methods).forEach((store) => {
    if (!$store[store]) {
      throw new Error(`Store ${store} does not exist.`);
    }

    if(methods[store] === true) {
      $store[store].$$methods.forEach((method) => {
        component[method] = function(...args: any[]) {
          return $store[store][method].apply($store[store], args);
        };
      });
    } else if (Array.isArray(methods[store])) {
      methods[store].forEach((method: string) => {
        component[method] = function(...args: any[]) {
          return $store[store][method].apply($store[store], args);
        };
      });
    }
  });
}
