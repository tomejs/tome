declare module 'acorn-class-fields' {
  import { Parser } from 'acorn';
  const plugin: (BaseParser: typeof Parser) => typeof Parser;
  export default plugin;
}
