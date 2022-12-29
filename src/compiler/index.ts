import parse from './parser';
import { Node } from 'acorn';
import { simple as walkSimple } from 'acorn-walk';
import { PropertyDefinition, MethodDefinition, MemberExpression, DependencyList, Initializers } from './utils/types';
import { generate } from 'astring';
import { render } from './render';

export function compile (source: string): string {
  const { classAST, template, imports } = parse(source);
  let result = '';
  const reservedMethods: string[] = ['created', 'mounted', 'updated', 'destroyed'];
  const reservedProps: string[] = ['$refs', '$store'];
  const mapProps: string[] = ['$mapStore', '$mapState', '$mapGetters', '$mapSetters', '$mapMethods'];
  const privateProps: string[] = [];
  const stateProps: string[] = [];
  const statePropInitializers: Initializers = {};
  const privatePropInitializers: Initializers = {};
  const deps: DependencyList = {};
  const getters: string[] = [];
  const setters: string[] = [];
  const methods: string[] = [];
  const getterNodes: Node[] = [];
  const setterNodes: Node[] = [];
  const methodNodes: Node[] = [];
  let mapStore: string = '';
  let mapState: string = '';
  let mapGetters: string = '';
  let mapSetters: string = '';
  let mapMethods: string = '';

  imports.forEach((imp) => {
    result += imp;
  });

  walkSimple(classAST, {
    PropertyDefinition (node: PropertyDefinition) {
      const name = node.key.name;
      if(node.key.type === 'Identifier') {
        if(mapProps.includes(name)) {
          if(name === '$mapStore') {
            mapStore = generate(node.value);
          } else if(name === '$mapState') {
            mapState = generate(node.value);
          } else if(name === '$mapGetters') {
            mapGetters = generate(node.value);
          } else if(name === '$mapSetters') {
            mapSetters = generate(node.value);
          } else if(name === '$mapMethods') {
            mapMethods = generate(node.value);
          }
        } else if(reservedProps.includes(name)) {
          throw new Error(`Cannot use reserved prop name:  + '${name}'`);
        } else {
          stateProps.push(name);
          statePropInitializers[name] = node.value;
        }
      } else if(node.key.type === 'PrivateIdentifier') {
        privateProps.push(name);
        privatePropInitializers[name] = node.value;
      }
    },
    MethodDefinition (node: MethodDefinition) {
      const name = node.key.name;
      if(node.kind === 'get') {
        getters.push(name);
        getterNodes.push(node);
        deps[name] = [];
        walkSimple(node.value, {
          MemberExpression (node: MemberExpression) {
            if(node.object.type === 'ThisExpression'
              && node.property.type === 'Identifier'
              && !reservedProps.includes(node.property.name)
            ) {
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
              if(node.object.type === 'ThisExpression'
                && node.property.type === 'Identifier'
                && !reservedProps.includes(node.property.name)
              ) {
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

  result += 'import { Component, node, text, state, immutable, ifblock, each, keyedEach, slot, mapStore, mapState, mapGetters, mapSetters, mapMethods } from "tomejs/internal";\n\n';

  result += 'export default class extends Component {\n';

  result += 'constructor(props) {\n';
  result += 'super(props);\n';

  if(mapStore) {
    result += `mapStore(this, ${mapStore});\n`;
  }
  if(mapState) {
    result += `mapState(this, ${mapState});\n`;
  }

  if(mapGetters) {
    result += `mapGetters(this, ${mapGetters});\n`;
  }

  if(mapSetters) {
    result += `mapSetters(this, ${mapSetters});\n`;
  }

  if(mapMethods) {
    result += `mapMethods(this, ${mapMethods});\n`;
  }

  result += `this.$$stateProps = ${JSON.stringify(stateProps)};\n`;
  result += `this.$$privateProps = ${JSON.stringify(privateProps)};\n`;
  result += `this.$$methods = ${JSON.stringify(methods)};\n`;
  result += `this.$$getters = ${JSON.stringify(getters)};\n`;
  result += `this.$$setters = ${JSON.stringify(setters)};\n`;

  stateProps.forEach(prop => {
    if(reservedProps.includes(prop)) {
      throw new Error(`Cannot use reserved prop name:  + '${prop}'`);
    }
    result += `this.$$${prop} = ${generate(statePropInitializers[prop])};\n`;
  });

  privateProps.forEach(prop => {
    if(reservedProps.includes(prop)) {
      throw new Error(`Cannot use reserved prop name:  + '${prop}'`);
    }
    result += `this.$$${prop} = ${generate(privatePropInitializers[prop])};\n`;
  });

  for(const key in deps) {
    deps[key].forEach(dep => {
      result += `this.$$sub('${dep}', () => this.$$pub('${key}'));\n`;
    });
  }

  result += 'this.created();\n';
  result += '}\n\n';

  stateProps.forEach(prop => {
    if(reservedProps.includes(prop)) {
      return;
    }
    result += `get ${prop}() {\n`;
    result += `if(typeof this.$$${prop} === 'object') {\n`;
    result += `return state(this.$$${prop}, () => this.$$pub('${prop}'));\n`;
    result += `}\n`;
    result += `return this.$$${prop};\n`;
    result += '}\n\n';
    result += `set ${prop}(value) {\n`;
    result += `this.$$${prop} = value;\n`;
    result += `this.$$pub('${prop}');\n`;
    result += '}\n\n';
  });

  privateProps.forEach(prop => {
    result += `get ${prop}() {\n`;
    result += `if(typeof this.$$${prop} === 'object') {\n`;
    result += `return immutable(this.$$${prop}, () => {\n`;
    result += `throw new Error('Cannot mutate the component property \\'${prop}\\'');\n`;
    result += '});\n';
    result += `}\n`;
    result += `return this.$$${prop};\n`;
    result += '}\n\n';
  });

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

  result += '}\n';

  return result;
}
