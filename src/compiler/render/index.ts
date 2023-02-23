import { NodeList } from "../parser/utils/types";
import renderNode from "./render_node";

export function render (template: NodeList): string {
  let result = 'render(root, anchor) {\n';
  result += 'const subs = [];\n';
  template.forEach(node => {
    result += renderNode(node, 'root', template, template.indexOf(node));
  });

  result += '}\n';

  return result;
}
