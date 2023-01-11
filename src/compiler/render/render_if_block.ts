import { ControlNode, AnyNode, NodeList, HTMLTextNode } from "../parser/utils/types";
import getDeps from "../utils/get_deps";
import changeToFunctionCall from "../utils/change_to_function_call";
import nodeName from "../utils/node_name";
import renderNode from "./render_node";

export default function renderIfBlock (
  _node: AnyNode, parentName: string, template: NodeList, index: number, isParentControlNode?: boolean,
  isParentEachNode?: boolean, eachContext?: { item: string, index: string }
) {
  let code = '';
  const node = _node as ControlNode;
  const { tagName } = node;
  const name = nodeName(tagName);

  let next = index + 1;
  const conditionNodes = [node];

  while (template[next]) {
    const { type } = template[next] as AnyNode;

    if (type === 'text' && (template[next] as HTMLTextNode).value.trim() === '') {
      template.splice(next, 1);
      continue;
    } else if(type === 'node' && (template[next] as ControlNode).tagName === 'else-if') {
      conditionNodes.push(template[next] as ControlNode);
      template.splice(next, 1);
    } else {
      break;
    }
  }

  if(
    template[next]
    && template[next].type === 'node'
    && (template[next] as  ControlNode).tagName === 'else'
  ) {
    conditionNodes.push(template[next] as ControlNode);
    template.splice(next, 1);
  }

  code += `const ${name} = ifblock([\n`;
  code += conditionNodes.map((conditionNode) => {
    let { expression } = conditionNode;
    if(isParentEachNode) {
      expression = changeToFunctionCall(expression, eachContext);
    }
    return `() => ${expression}`;
  }).join(',\n');
  code += `\n],[\n`;
  code += conditionNodes.map((conditionNode) => {
    const { children } = conditionNode;
    let code = '';

    children.forEach((child, index) => {
      code += renderNode(child, name, children, index, true, isParentEachNode);
    });

    return `() => {\nconst children = [];\n${code}\nreturn children;\n}`;
  }).join(',\n');
  code += `\n]);\n`;

  const deps: string[] = [];
  conditionNodes.forEach((conditionNode) => {
    const { expression, tagName } = conditionNode;

    if(tagName !== 'else') {
      deps.push(...getDeps(expression));
    }
  });

  if(deps.length > 0) {
    code += `this.$$sub(${JSON.stringify(deps)}, () => {\n${name}.update();\n});\n`;
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
    code += `updates.push(() => ${name}.update());\n`;
  }

  return code;
}
