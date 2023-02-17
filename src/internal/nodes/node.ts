
export default function node(name: string) {
  const root = document.createElement(name);

  return {
    root,
    mount(parent: HTMLElement, anchor: HTMLElement) {
      if(anchor) {
        parent.insertBefore(root, anchor);
      } else {
        parent.append(root);
      }
    },
    unmount() {
      root.remove();
    },
    append(child: HTMLElement) {
      root.append(child);
    },
    insertBefore(child: HTMLElement, anchor: HTMLElement) {
      root.insertBefore(child, anchor ? anchor : null);
    },
    setAttribute(name: string, value: string | Array<string|object> | object) {
      let processed = value;
      if (Array.isArray(value)) {
        processed = value.map((v) => {
          if (typeof v === 'object') {
            return Object.keys(v).map((k) => {
              return v[k] ? k : '';
            }).join();
          }
          return v;
        }).join(' ');
      } else if (typeof value === 'object') {
        processed = Object.keys(value).map((k) => {
          return value ? k : '';
        }).join(' ');
      }
      root.setAttribute(name, '' + processed);
    },
    addEventListener(name: string, handler: () => void) {
      root.addEventListener(name, handler);
    },
    update() {
    }
  };
}
