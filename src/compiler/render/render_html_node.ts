import { AnyNode, HTMLNode } from "../parser/utils/types";
import nodeName from "./node_name";
import renderNode from "./render_node";
import getDeps from "./get_deps";

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
    console.log(attribute);
    if(attribute.type === 'string' || attribute.type === 'boolean') {
      code += `${name}.setAttribute('${attribute.name}', '${attribute.value}');\n`;
    } else if(attribute.type === 'expression') {
      code += `${name}.setAttribute('${attribute.name}', ${attribute.value});\n`;
      const deps = getDeps(attribute.value as string);
      if(deps.length > 0) {
        code += `this.$$sub(${JSON.stringify(deps)}, () => {\n`;
        code += `${name}.setAttribute('${attribute.name}', ${attribute.value});\n`;
        code += `});\n`;
      }
    }
  });

  children.forEach((child, index) => {
    code += renderNode(child, name, children, index, isParentControlNode, isParentEachNode);
  });

  if(isParentControlNode) {
    code += `children.push(${name});\n`;
  } else {
    code += `${name}.mount(${parentName});\n`;
  }

  return code;
}
