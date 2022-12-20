
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
    update() {
    }
  };
}
