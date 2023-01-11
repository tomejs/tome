import { Parser } from "acorn";
import { simple as walkSimple } from "acorn-walk";
import { generate } from "astring";

export default function changeToFunctionCall(source: string, eachContext: { item: string, index: string }) {
  const ast = Parser.parse(source, { ecmaVersion: 2020 });
  walkSimple(ast, {
    MemberExpression(node: any) {
      const object = node.object;
      if (object.type === 'Identifier' && (object.name === eachContext.item || object.name === eachContext.index)) {
        object.type = 'CallExpression';
        object.callee = {
          type: 'Identifier',
          name: object.name,
        };
        object.arguments = [];
        object.optional = false;
      }
    },
    Identifier(node: any) {
      if (node.name === eachContext.item || node.name === eachContext.index) {
        node.type = 'CallExpression';
        node.callee = {
          type: 'Identifier',
          name: node.name,
        };
        node.arguments = [];
        node.optional = false;
      }
    }
  });

  return generate(ast).replace(/;\s$/, '');
}
