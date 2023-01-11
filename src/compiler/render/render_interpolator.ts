import { AnyNode, HTMLTextInterpolationNode } from "../parser/utils/types";
import nodeName from "../utils/node_name";
import getDeps from "../utils/get_deps";
import changeToFunctionCall from "../utils/change_to_function_call";

export default function renderInterpolator(
  node: AnyNode, parentName: string, isParentControlNode?: boolean, isParentEachNode?: boolean,
  eachContext?: { item: string, index: string }
) {
  let code = '';
  const name = nodeName('text');
  let { expression } = node as HTMLTextInterpolationNode;
  const deps = getDeps(expression);

  if(isParentEachNode) {
    expression = changeToFunctionCall(expression, eachContext);
  }

  code += `const ${name} = text(${expression})\n`;

  if(deps.length > 0) {
    code += `this.$$sub(${JSON.stringify(deps)}, () => {\n${name}.update(${expression});\n});\n`;
  }

  if(isParentControlNode) {
    code += `children.push(${name});\n`;
  } else {
    if(parentName === 'root') {
      code += `${name}.mount(${parentName}, anchor);\n`;
      code += `this.$$nodes.push(${name});\n`;
    } else {
      code += `${name}.mount(${parentName});\n`;
    }
  }

  if(isParentEachNode) {
    code += `updates.push(() => ${name}.update(${expression}));\n`;
  }

  return code;
}
