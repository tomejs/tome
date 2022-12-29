import Component from '../component';

export default function mapState(component: Component, states: any) {
  const $store = component.$store;
  if (!$store) {
    throw new Error('Tome has no stores provided. Please provide a store to the Tome instance.');
  }

  Object.keys(states).forEach((store) => {
    if (!$store[store]) {
      throw new Error(`Store ${store} does not exist.`);
    }

    if(states[store] === true) {
      $store[store].$$stateProps.forEach((prop) => {
        $store[store].$$sub(prop, (data) => {
          component[`$${prop}`] = $store[store][prop];
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
    } else if (Array.isArray(states[store])) {
      states[store].forEach((prop: string) => {
        $store[store].$$sub(prop, (data) => {
          component[`$${prop}`] = $store[store][prop];
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
    }
  });
}
