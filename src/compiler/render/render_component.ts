import { AnyNode, HTMLNode } from '../parser/utils/types';
import nodeName from '../utils/node_name';
import getDeps from '../utils/get_deps';
import changeToFunctionCall from '../utils/change_to_function_call';
import isMember from '../utils/is_member';
import renderNode from './render_node';

export default function renderComponent(
  node: AnyNode, parentName: string, isParentControlNode?: boolean, isParentEachNode?: boolean,
  eachContext?: { item: string, index: string }
) {
  let code = '';
  const { tagName, attributes, children } = node as HTMLNode;
  const name = nodeName(tagName).replace(/-/g, '_');
  let ref = '';

  code += `const ${name}Component = (this.$$components && this.$$components['${tagName}']) || this.$components['${tagName}'];\n`;
  code += `if(!${name}Component) throw new Error('Component ${tagName} is not defined');\n`;
  code += `const ${name} = new ${name}Component(this.$ctx);\n`;

  if (attributes.length > 0) {
    code += `${name}.setProps({\n`;
    attributes.forEach((attribute) => {
      if (attribute.name === 'ref') {
        ref = attribute.value as string;
      } else if(!attribute.name.startsWith('@')) {
        if(attribute.type === 'expression' || attribute.type === 'boolean') {
          if(isParentEachNode) {
            code += `${attribute.name}: ${changeToFunctionCall(attribute.value as string, eachContext)},\n`;
          } else {
            code += `${attribute.name}: ${attribute.value},\n`;
          }
        } else {
          code += `${attribute.name}: '${(attribute.value as string).replace('\'', '\\\'')}',\n`;
        }
      }
    });
    code += `});\n`;

    attributes.filter((attribute) => attribute.name.startsWith('@')).forEach((attribute) => {
      const eventName = attribute.name.slice(1);
      const isMemberExpression = isMember(attribute.value as string);
      if(isMemberExpression) {
        code += `${name}.addEventListener('${eventName}', ${attribute.value}.bind(this));\n`;
      } else {
        code += `${name}.addEventListener('${eventName}', ($event) => {\n`;
        code += `${attribute.value};\n`;
        code += `});\n`;
      }
    });

    if (ref) {
      code += `this.$refs['${ref}'] = ${name};\n`;
    }

    attributes.forEach((attribute) => {
      if (attribute.type === 'expression') {
        const deps = getDeps(attribute.value as string);
        deps.forEach((dep) => {
          code += `this.$$sub('${dep}', () => {\n${name}.$$pub('${dep}');});\n`;
        });
      }
    });
  }

  if(children.length > 0) {
    const slotFnName = nodeName('defaulSlotFn');
    code += `const ${slotFnName} = () => {\n`;
    code += `const children = [];\n`;
    children.forEach((child, index) => {
      code += renderNode(child, name, children, index, true, isParentEachNode, eachContext);
    });
    code += `return children;\n`;
    code += '};\n';
    code += `${name}.setSlotFn('$default', ${slotFnName});\n`;
  }

  if (isParentControlNode) {
    code += `children.push(${name});\n`;
  } else {
    code += `${name}.mount(${parentName});\n`;
  }

  if(isParentEachNode) {
    code += `updates.push(() => ${name}.update());\n`;
  }

  return code;
}
