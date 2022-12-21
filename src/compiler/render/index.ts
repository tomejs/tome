import { NodeList } from "../parser/utils/types";
import renderNode from "./render_node";

export function render (template: NodeList): string {
  let result = 'render(root) {\n';

  template.forEach(node => {
    result += renderNode(node, 'root');
  });

  result += '}\n';

  return result;
}
