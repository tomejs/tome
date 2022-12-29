import Component from "../component";

export default function mapGetters(component: Component, getters: any) {
  const $store = component.$store;
  if (!$store) {
    throw new Error('Tome has no stores provided. Please provide a store to the Tome instance.');
  }

  Object.keys(getters).forEach((store) => {
    if (!$store[store]) {
      throw new Error(`Store ${store} does not exist.`);
    }

    if(getters[store] === true) {
      $store[store].$$getters.forEach((getter) => {
        component[getter] = function(...args: any[]) {
          return $store[store][getter].apply($store[store], args);
        };
      });
    } else if (Array.isArray(getters[store])) {
      getters[store].forEach((getter: string) => {
        component[getter] = function(...args: any[]) {
          return $store[store][getter].apply($store[store], args);
        };
      });
    }
  });
}
