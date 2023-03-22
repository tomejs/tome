const SVG_NODES = ["svg", "animate", "animateMotion", "animateTransform", "circle", "clipPath", "defs", "desc", "ellipse",
  "feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap",
  "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage",
  "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile",
  "feTurbulence", "filter", "foreignObject", "g", "image", "line", "linearGradient", "marker", "mask", "metadata", "mpath",
  "path", "pattern", "polygon", "polyline", "radialGradient", "rect", "stop", "switch", "symbol", "text", "textPath", "tspan",
  "use", "view"];

function getNamespaceForAttribute(name: string) {
  if(name.startsWith('xlink:')) {
    return 'http://www.w3.org/1999/xlink';
  } else if(name.startsWith('xml:')) {
    return 'http://www.w3.org/XML/1998/namespace';
  } else if(name.startsWith('xmlns')) {
    return 'http://www.w3.org/2000/xmlns/';
  }
  return null;
}

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
        if(isSVG) {
          const namespace = getNamespaceForAttribute(name);
          root.setAttributeNS(namespace, name, '' + processed);
        } else {
          root.setAttribute(name, '' + processed);
        }
      } else if(processed === false) {
        root.removeAttribute(name);
      } else if(processed === true) {
        if(isSVG) {
          const namespace = getNamespaceForAttribute(name);
          root.setAttributeNS(namespace, name, '');
        } else {
          root.setAttribute(name, '');
        }
      }
    },
    addEventListener(name: string, handler: () => void) {
      root.addEventListener(name, handler);
    },
    update() {
    }
  };
}
