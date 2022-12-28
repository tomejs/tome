import { AnyNode, HTMLNode } from '../parser/utils/types';
import nodeName from '../utils/node_name';
import getDeps from '../utils/get_deps';
import isMember from '../utils/is_member';
import renderNode from './render_node';

export default function renderComponent(
  node: AnyNode, parentName: string, isParentControlNode?: boolean, isParentEachNode?: boolean
) {
  let code = '';
  const { tagName, attributes, children } = node as HTMLNode;
  const name = nodeName(tagName);
  let ref = '';

  code += 'try {\n';
  code += `const ${name} = new this.$$components.${tagName}();\n`;

  if (attributes.length > 0) {
    code += `${name}.setProps({\n`;
    attributes.forEach((attribute) => {
      if (attribute.name === 'ref') {
        ref = attribute.value as string;
      } else if(!attribute.name.startsWith('@')) {
        if(attribute.type === 'expression' || attribute.type === 'boolean') {
          code += `${attribute.name}: ${attribute.value},\n`;
        } else {
          code += `${attribute.name}: '${attribute.value}',\n`;
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

    const deps = getDeps(attributes.map((attribute) => attribute.value).join(','));

    deps.forEach((dep) => {
      code += `this.$$sub('${dep}', () => {\n${name}.$$pub('${dep}');});\n`;
    });
  }

  code += `const defaultSlotFn = () => {\n`;
  code += `const children = [];\n`;
  children.forEach((child, index) => {
    code += renderNode(child, name, children, index, true, isParentEachNode);
  });
  code += `return children;\n`;
  code += '};\n';
  code += `${name}.setSlotFn('$default', defaultSlotFn);\n`;

  if (isParentControlNode) {
    code += `children.push(${name});\n`;
  } else {
    code += `${name}.mount(${parentName});\n`;
  }

  if(isParentEachNode) {
    code += `updates.push(() => ${name}.update());\n`;
  }


  code += '} catch(e) {\n';
  code += `throw new Error('Component \\'${tagName}\\' not found');\n`;
  code += '}\n';

  return code;
}
