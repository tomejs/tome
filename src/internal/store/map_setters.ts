import Component from "../component";

export default function mapSetters(component: Component, setters: any) {
  const $store = component.$store;
  if (!$store) {
    throw new Error('Tome has no stores provided. Please provide a store to the Tome instance.');
  }

  Object.keys(setters).forEach((store) => {
    if (!$store[store]) {
      throw new Error(`Store ${store} does not exist.`);
    }

    if(setters[store] === true) {
      $store[store].$$setters.forEach((setter) => {
        component[setter] = function(...args: any[]) {
          $store[store][setter].apply($store[store], args);
        };
      });
    } else if (Array.isArray(setters[store])) {
      setters[store].forEach((setter: string) => {
        component[setter] = function(...args: any[]) {
          $store[store][setter].apply($store[store], args);
        };
      });
    }
  });
}
