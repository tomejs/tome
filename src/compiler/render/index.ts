import { NodeList } from "../parser/utils/types";
import renderNode from "./render_node";

export function render (template: NodeList): string {
  let result = 'function render(root) {\n';

  template.forEach(node => {
    result += renderNode(node, 'root');
  });

  result += 'this.mounted();\n';

  result += '}\n';

  return result;
}
