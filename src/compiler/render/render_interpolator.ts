import { AnyNode, HTMLTextInterpolationNode } from "../parser/utils/types";
import nodeName from "./node_name";
import getDeps from "./get_deps";


export default function renderInterpolator(node: AnyNode, parentName: string, isParentControlNode?: boolean) {
  let code = '';
  const name = nodeName('text');
  const { expression } = node as HTMLTextInterpolationNode;
  const deps = getDeps(expression);

  code += `const ${name} = text(${expression})\n`;
  code += `this.$$sub(${JSON.stringify(deps)}, () => {\n${name}.update(${expression});\n});\n`;

  if(isParentControlNode) {
    code += `children.push(${name});\n`;
  } else {
    code += `${name}.mount(${parentName});\n`;
  }

  return code;
}
