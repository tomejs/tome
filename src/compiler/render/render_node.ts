import { AnyNode, HTMLNode, HTMLTextInterpolationNode, HTMLTextNode } from '../parser/utils/types';
import nodeName from './node_name';
import getDeps from './get_deps';

export default function renderNode(node: AnyNode, parentName: string): string {
  let code = '';
  if(node.type === 'text') {
    let { value } = node as HTMLTextNode;
    value = value.replace(/\n/g, ' ').replace(/\t/g, ' ').replace(/\r/g, ' ');
    const name = nodeName('text');
    code += `const ${name} = text('${value}');\n`;
    code += `${name}.mount(${parentName});\n`;
  } else if(node.type === 'interpolator') {
    const name = nodeName('text');
    const { expression } = node as HTMLTextInterpolationNode;
    const deps = getDeps(expression);
    code += `const ${name} = text(${expression})\n`;
    deps.forEach(dep => {
      code += `this.$$sub('${dep}', () => {\nname.update(${expression});\n});\n`;
    });
    code += `${name}.mount(${parentName});\n`;
  } else if(node.type === 'node') {
    const { tagName, attributes, children } = node as HTMLNode;
    const name = nodeName(tagName);
    code += `const ${name} = node(${tagName}, ${JSON.stringify(attributes)});\n`;
    children.forEach(child => {
      code += renderNode(child, name);
    });
    code += `${name}.mount(${parentName});\n`;
  }

  return code;
}
