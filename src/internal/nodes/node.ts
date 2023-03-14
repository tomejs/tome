const SVG_NODES = ['svg', 'g', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'text', 'tspan', 'image', 'clipPath',
  'mask', 'filter', 'pattern', 'marker', 'linearGradient', 'radialGradient', 'stop', 'symbol', 'use', 'defs', 'foreignObject',
  'desc', 'title'];

export default function node(name: string) {
  let root: HTMLElement | SVGElement;
  const isSVG = SVG_NODES.includes(name);
  if(isSVG) {
    root = document.createElementNS('http://www.w3.org/2000/svg', name);
  } else {
    root = document.createElement(name);
  }

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
    setAttribute(name: string, value: string | Array<string|object> | object | boolean) {
      let processed = value;
      if (Array.isArray(value)) {
        processed = value.map((v) => {
          if (typeof v === 'object') {
            return Object.keys(v).map((k) => {
              return v[k] ? k : '';
            }).join(' ');
          }
          return v;
        }).join(' ');
      } else if (typeof value === 'object') {
        processed = Object.keys(value).map((k) => {
          return value ? k : '';
        }).join(' ');
      }

      if(typeof processed === 'string' && processed.length) {
        root.setAttribute(name, '' + processed);
      } else if(processed === false) {
        root.removeAttribute(name);
      } else if(processed === true) {
        root.setAttribute(name, '');
      }
    },
    addEventListener(name: string, handler: () => void) {
      root.addEventListener(name, handler);
    },
    update() {
    }
  };
}
