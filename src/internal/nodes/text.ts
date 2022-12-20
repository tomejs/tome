export default function text(value: string) {
  const root = document.createTextNode(value);
  let cache: string = value;

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
    update(value: string) {
      if(value !== cache) {
        root.textContent = value;
        cache = value;
      }
    }
  };
}
