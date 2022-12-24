import { Parser } from 'acorn';
import { simple as walkSimple } from 'acorn-walk';
import { MemberExpression } from '../../types';

export default function getDeps(expression: string) {
  const deps: string[] = [];
  const ast = Parser.parse(expression, { ecmaVersion: 2020 });
  walkSimple(ast, {
    MemberExpression(node: MemberExpression) {
      const { object, property } = node;
      if(object.type === 'ThisExpression' && property.type === 'Identifier') {
        deps.push(property.name);
      }
    }
  });
  return deps;
}
