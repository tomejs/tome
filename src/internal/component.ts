export default class Component {
  $$props: {[key: string]: any};
  $$subs: {[key: string]: (() => void)[]} = {};
  constructor(props: {[key: string]: any}) {
    this.$$props = props;
  }

  $$sub(name: string | string[], fn: () => void) {
    if(typeof name === 'string') {
      if(!this.$$subs[name]) {
        this.$$subs[name] = [];
      }
      this.$$subs[name].push(fn);
    } else if(Array.isArray(name)) {
      name.forEach(n => this.$$sub(n, fn));
    }
  }

  $$pub(name: string) {
    this.$$subs[name].forEach(fn => fn());
  }

  created() {}
  mounted() {}
  updated() {}
  destroyed() {}
}
