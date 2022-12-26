import { Parser } from 'acorn';
import { MemberExpression, ASTProgram, ExpressionStatement } from './types';



export default function isMember(expression: string) {
  const ast: ASTProgram = Parser.parse(expression, { ecmaVersion: 2020 }) as ASTProgram;
  const property = ast.body[0] as ExpressionStatement;

  if(property.type === 'ExpressionStatement' && (property.expression as MemberExpression).type === 'MemberExpression') {
    return true;
  }

  return false;
}
