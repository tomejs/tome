import { Slot } from './nodes/types';

export default class Component {
  $$props: {[key: string]: any};
  $$subs: {[key: string]: ((data: any) => void)[]} = {};
  $refs: {[key: string]: HTMLElement} = {};
  $$slots: {[key: string]: Slot} = {};
  $$slotFns: {[key: string]: () => any[]} = {};
  $store: {[key: string]: Component};
  $ctx: {[key: string]: any};
  $$stateProps: string[];
  $$privateProps: string[];
  $$getters: string[];
  $$setters: string[];
  $$methods: string[];
  [key: string]: any;

  constructor(ctx: {[key: string]: any}) {
    this.$ctx = ctx;
    this.$store = ctx.$store;
  }

  $$sub(name: string | string[], fn: (data: any) => void) {
    if(typeof name === 'string') {
      if(!this.$$subs[name]) {
        this.$$subs[name] = [];
      }
      this.$$subs[name].push(fn);
    } else if(Array.isArray(name)) {
      name.forEach(n => this.$$sub(n, fn));
    }
  }

  $$pub(name: string, data: any) {
    this.$$subs[name] && this.$$subs[name].forEach(fn => fn(data));
  }

  created() {}
  mounted() {}
  updated() {}
  destroyed() {}
  render(target: HTMLElement) {}

  mount(target: HTMLElement) {
    this.render(target);
    this.mounted();
  }

  update() {
    for(const key in this.$$subs) {
      if(!key.startsWith('$$')) {
        this.$$subs[key] && this.$$subs[key].forEach(fn => fn(undefined));
      }
    }
  }

  setProps(props: {[key: string]: any}) {
    for(const key in props) {
      (this as {[key: string] : any})[`$$${key}`] = props[key];
    }
  }

  addEventListener(event: string, fn: () => void) {
    this.$$sub(`$$${event}`, fn);
  }

  $emit(event: string, ...args: any[]) {
    this.$$pub.apply(this, [`$$${event}`, ...args]);
  }

  setSlotFn(name: string, fn: () => any[]) {
    this.$$slotFns[name] = fn;
    //this.$$slots[name].setCreationFn(fn);
  }
}
