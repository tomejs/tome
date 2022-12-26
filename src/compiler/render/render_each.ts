import { AnyNode, ControlNode } from '../parser/utils/types'
import nodeName from '../utils/node_name';
import renderNode from './render_node';
import getDeps from '../utils/get_deps';
import parseEachExpression from '../utils/parse_each_expression';

export default function renderEach(
  _node: AnyNode, parentName: string, _index: number, isParentControlNode?: boolean, isParentEachNode?: boolean
) {
  let code = '';
  const { expression, children } = _node as ControlNode;
  const name = nodeName('each');
  const { collection, item, index, key } = parseEachExpression(expression);
  const deps = getDeps(collection);

  if(key) {
    code += `const ${name} = keyedEach(() => ${collection}, (${item}, ${index}) => ${key}, (${item}, ${index}) => {\n`;
  } else {
    code += `const ${name} = each(() => ${collection}, (${item}, ${index}) => {\n`;
  }

  let childCode = '';
  children.forEach((child, _index) => {
    childCode += renderNode(child, name, children, _index, true, true);
  });

  code += `const children = [];\nconst updates = [];\n`
  code += `${childCode}`;
  code += `\nreturn { nodes: children, update: () => updates.forEach(cb => cb()) };\n});\n`;

  if(deps.length > 0) {
    code += `this.$$sub(${JSON.stringify(deps)}, () => {\n${name}.update();\n});\n`;
  }

  if(isParentControlNode) {
    code += `children.push(${name});\n`;
  } else {
    code += `${name}.mount(${parentName});\n`;
  }

  if(isParentEachNode) {
    code += `updates.push(() => ${name}.update());\n`;
  }

  return code;
}
