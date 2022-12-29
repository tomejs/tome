import { HTMLNode } from "../parser/utils/types";
import renderNode from "./render_node";

export default function renderSlot(node: HTMLNode, parentName: string, isParentControlNode?: boolean) {
  let code = '';
  const { attributes, children } = node;
  let name = '$default';

  attributes.forEach((attribute) => {
    if(attribute.type === 'string' || attribute.type === 'boolean') {
      if(attribute.name === 'name') {
        name = attribute.value as string;
      }
    }
  });

  code += `const ${name} = slot('${name}', () => {\n`;
  code += `const children = [];\n`;
  children.forEach((child, index) => {
    code += renderNode(child, name, children, index, true);
  });
  code += `return children;\n`;
  code += `});\n`;

  code += `if(this.$$slotFns['${name}']) {\n`;
  code += `${name}.setCreationFn(this.$$slotFns['${name}']);\n`;
  code += `}\n`;

  code += `this.$$slots['${name}'] = ${name};\n`

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
