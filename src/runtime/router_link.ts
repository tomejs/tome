import { Component, node, immutable, slot } from "../internal";

export default class extends Component {
  constructor(props: any) {
    super(props);
    this.$$methods = ["handleClick"];
    this.$$to = '';
    this.$$sub('to', () => this.$$pub('handleClick'));
    this.created();
  }

  get to() {
    if(typeof this.$$to === 'object') {
      return immutable(this.$$to, () => {
        throw new Error('Cannot mutate the component property \'to\'');
      });
    }
    return this.$$to;
  }

  handleClick(ev: Event) {
    ev.preventDefault();
    this.$ctx.$router.push(this.to);
  }
  render(root: HTMLElement, anchor?: HTMLElement) {
    const a = node('a');
    a.setAttribute('href', this.to);
    this.$$sub(["to"], () => {
      a.setAttribute('href', this.to);
    });
    a.addEventListener('click', this.handleClick.bind(this));
    const $default = slot('$default', () => {
      const children: any[] = [];
      return children;
    });
    if(this.$$slotFns['$default']) {
      $default.setCreationFn(this.$$slotFns['$default']);
    }
    this.$$slots.$default = $default;
    $default.mount(a);
    a.mount(root, anchor);
    this.$$nodes.push(a);
  }
}
