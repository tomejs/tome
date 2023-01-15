import { AnyNode, HTMLNode, HTMLNodeAttribute } from '../parser/utils/types';
import nodeName from '../utils/node_name';
import getDeps from '../utils/get_deps';
import changeToFunctionCall from '../utils/change_to_function_call';
import isMember from '../utils/is_member';

export default function renderDynamicComponent(
  node: AnyNode, parentName: string, isParentControlNode?: boolean, isParentEachNode?: boolean,
  eachContext?: { item: string, index: string }
) {
  let code = '';
  let { attributes } = node as HTMLNode;
  const name = nodeName('dynamicComponent');
  let ref = '';
  let componentName = attributes.find((attribute: HTMLNodeAttribute) => attribute.name === 'name')?.value as string;
  attributes = attributes.filter((attribute: HTMLNodeAttribute) => attribute.name !== 'name');

  code += 'try {\n';
  code += `let ${name} = null;\n`;
  code += `const ${name}Create = () => {\n`;
  code += `${name} = new this.$$components[${componentName}](this.$ctx);\n`;
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

    const deps = getDeps(attributes.map((attribute) => attribute.value).join(','));

    deps.forEach((dep) => {
      code += `this.$$sub('${dep}', () => {\n${name}.$$pub('${dep}');});\n`;
    });
  }
  if (isParentControlNode) {
    code += `children.push(${name});\n`;
  } else {
    code += `${name}.mount(${parentName});\n`;
  }

  if(isParentEachNode) {
    code += `updates.push(() => ${name}.update());\n`;
  }

  code += `}\n`;
  code += `${name}Create();\n`;

  const deps = getDeps(componentName);

  code += `this.$$sub(${JSON.stringify(deps)}, () => {\n`;
  code += `${name}.unmount();\n`;
  code += `${name}Create();\n`;
  code += `});\n`;

  code += '} catch(e) {\n';
  code += `throw new Error('Component \\'${componentName}\\' not found');\n`;
  code += '}\n';

  return code;
}
