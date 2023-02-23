import { HTMLNode } from "../parser/utils/types";
import nodeName from "../utils/node_name";
import renderNode from "./render_node";
import getDeps from "../utils/get_deps";
import changeToFunctionCall from "../utils/change_to_function_call";
import isMember from "../utils/is_member";

export default function renderHTMLNode(
  node: HTMLNode,
  parentName: string,
  isParentControlNode?: boolean,
  isParentEachNode?: boolean,
  eachContext?: { item: string, index: string }
) {
  let code = '';
  const { tagName, attributes, children } = node;
  const name = nodeName(tagName);

  code += `const ${name} = node('${tagName}');\n`;

  attributes.forEach((attribute) => {
    if(attribute.type === 'string' || attribute.type === 'boolean') {
      if(attribute.name === 'ref') {
        code += `this.$refs['${(attribute.value as string).replace('\'', '\\\'')}'] = ${name}.root;\n`;
      } else {
        code += `${name}.setAttribute('${attribute.name}', '${(attribute.value as string).replace('\'', '\\\'')}');\n`;
      }
    } else if(attribute.type === 'expression') {
      if(attribute.name.startsWith('@')) {
        const eventName = attribute.name.slice(1);
        const isMemberExpression = isMember(attribute.value as string);
        if(isMemberExpression) {
          code += `${name}.addEventListener('${eventName}', ${attribute.value}.bind(this));\n`;
        } else {
          code += `${name}.addEventListener('${eventName}', ($event) => {\n`;
          if(isParentEachNode) {
            code += `${changeToFunctionCall(attribute.value as string, eachContext)};\n`;
          } else {
            code += `${attribute.value};\n`;
          }
          code += `});\n`;
        }
      } else {
        if(isParentEachNode) {
          code += `${name}.setAttribute('${attribute.name}', ${changeToFunctionCall(attribute.value as string, eachContext)});\n`;
        } else {
          code += `${name}.setAttribute('${attribute.name}', ${attribute.value});\n`;
        }
        const deps = getDeps(attribute.value as string);
        if(deps.length > 0) {
          code += 'subs.push(\n';
          code += `this.$$sub(${JSON.stringify(deps)}, () => {\n`;
          if(isParentEachNode) {
            code += `${name}.setAttribute('${attribute.name}', ${changeToFunctionCall(attribute.value as string, eachContext)});\n`;
          } else {
            code += `${name}.setAttribute('${attribute.name}', ${attribute.value});\n`;
          }
          code += `})\n`;
          code += ');\n';
        }

        if(isParentEachNode) {
          code += `updates.push(() => ${name}.setAttribute('${attribute.name}', ${changeToFunctionCall(attribute.value as string, eachContext)}));\n`;
        }
      }
    }
  });

  children.forEach((child, index) => {
    code += renderNode(child, name, children, index, false, isParentEachNode, eachContext);
  });

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

  return code;
}
