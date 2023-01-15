import { AnyNode, HTMLTextNode } from '../parser/utils/types';
import nodeName from '../utils/node_name';

export default function renderText (node: AnyNode, parentName: string, isParentControlNode?: boolean) {
  let code = '';
  let { value } = node as HTMLTextNode;

  value = value.replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/\r/g, ' ');
  const name = nodeName('text');
  code += `const ${name} = text('${value.replace('\'', '\\\'')}');\n`;

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
