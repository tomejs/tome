import { AnyNode, HTMLNode } from "../parser/utils/types";
import nodeName from "./node_name";
import renderNode from "./render_node";
import getDeps from "./utils/get_deps";
import isMember from "./utils/is_member";

export default function renderHTMLNode(
  node: AnyNode,
  parentName: string,
  isParentControlNode?: boolean,
  isParentEachNode?: boolean
) {
  let code = '';
  const { tagName, attributes, children } = node as HTMLNode;
  const name = nodeName(tagName);

  code += `const ${name} = node('${tagName}');\n`;

  attributes.forEach((attribute) => {
    if(attribute.type === 'string' || attribute.type === 'boolean') {
      if(attribute.name === 'ref') {
        code += `this.$refs['${attribute.value}'] = ${name}.root;\n`;
      } else {
        code += `${name}.setAttribute('${attribute.name}', '${attribute.value}');\n`;
      }
    } else if(attribute.type === 'expression') {
      if(attribute.name.startsWith('@')) {
        const eventName = attribute.name.slice(1);
        const isMemberExpression = isMember(attribute.value as string);
        if(isMemberExpression) {
          code += `${name}.addEventListener('${eventName}', ${attribute.value}.bind(this));\n`;
        } else {
          code += `${name}.addEventListener('${eventName}', ($event) => {\n`;
          code += `${attribute.value};\n`;
          code += `});\n`;
        }
      } else {
        code += `${name}.setAttribute('${attribute.name}', ${attribute.value});\n`;
        const deps = getDeps(attribute.value as string);
        if(deps.length > 0) {
          code += `this.$$sub(${JSON.stringify(deps)}, () => {\n`;
          code += `${name}.setAttribute('${attribute.name}', ${attribute.value});\n`;
          code += `});\n`;
        }

        if(isParentEachNode) {
          code += `updates.push(() => ${name}.setAttribute('${attribute.name}', ${attribute.value}));\n`;
        }
      }
    }
  });

  children.forEach((child, index) => {
    code += renderNode(child, name, children, index);
  });

  if(isParentControlNode) {
    code += `children.push(${name});\n`;
  } else {
    code += `${name}.mount(${parentName});\n`;
  }

  return code;
}
