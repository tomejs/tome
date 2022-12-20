import parse from './parser';
import { Node } from 'acorn';
import { simple as walkSimple } from 'acorn-walk';
import { PropertyDefinition, MethodDefinition, MemberExpression, DependencyList, Initializers } from './types';
import { generate } from 'astring';
import { render } from './render';

export default function compile (source: string): string {
  const { classAST, template } = parse(source);
  let result = '';
  const reservedMethods: string[] = ['created', 'mounted', 'updated', 'destroyed'];
  const stateProps: string[] = [];
  const statePropInitializers: Initializers = {};
  const deps: DependencyList = {};
  const getters = [];
  const setters = [];
  const methods = [];
  const getterNodes: Node[] = [];
  const setterNodes: Node[] = [];
  const methodNodes: Node[] = [];

  walkSimple(classAST, {
    PropertyDefinition (node: PropertyDefinition) {
      const name = node.key.name;
      stateProps.push(name);
      statePropInitializers[name] = node.value;
    },
    MethodDefinition (node: MethodDefinition) {
      const name = node.key.name;
      if(node.kind === 'get') {
        getters.push(name);
        getterNodes.push(node);
        deps[name] = [];
        walkSimple(node.value, {
          MemberExpression (node: MemberExpression) {
            if(node.object.type === 'ThisExpression' && node.property.type === 'Identifier') {
              deps[name].push(node.property.name);
            }
          }
        });
      } else if(node.kind === 'method') {
        methods.push(name);
        methodNodes.push(node);
        if(!reservedMethods.includes(name)) {
          deps[name] = [];
          walkSimple(node.value, {
            MemberExpression (node: MemberExpression) {
              if(node.object.type === 'ThisExpression' && node.property.type === 'Identifier') {
                deps[name].push(node.property.name);
              }
            }
          });
        }
      } else if(node.kind === 'set') {
        setters.push(name);
        setterNodes.push(node);
      }
    }
  });

  console.log(deps);

  result += 'import { Component, node, text, state, ifblock, each, keyedEach } from "tomejs/internal";\n\n';

  result += 'export default class extends Component {\n';

  result += 'constructor(props) {\n';
  result += 'super(props);\n';

  stateProps.forEach(prop => {
    result += `this.$$${prop} = ${generate(statePropInitializers[prop])};\n`;
  });

  for(const key in deps) {
    deps[key].forEach(dep => {
      result += `this.$$sub('${dep}', () => this.$$pub('${key}'));\n`;
    });
  }

  result += 'this.created();\n';
  result += '}\n\n';

  getterNodes.forEach(node => {
    result += generate(node) + '\n';
  });

  setterNodes.forEach(node => {
    result += generate(node) + '\n';
  });

  methodNodes.forEach(node => {
    result += generate(node) + '\n';
  });

  result += render(template);

  template;

  return result;
}
