import { EachExpression } from "./types";
import Tokenizer from "../parser/tokenizer";
import parseParenthesizedExpression from "../parser/parse/parse_parenthesized_expression";

function isIdentStartChar (char: string): boolean {
  return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char === '_' || char === '$';
}

function isIdentChar (char: string): boolean {
  return isIdentStartChar(char) || char >= '0' && char <= '9';
}

function parseIdentifier (tokens: Tokenizer): string {
  let result = '';

  if(isIdentStartChar(tokens.peek())) {
    result += tokens.shift();
  } else {
    throw new Error(`Unexpected token: ${tokens.peek()}`);
  }

  while(tokens.length() > 0 && isIdentChar(tokens.peek())) {
    result += tokens.shift();
  }

  return result;
}

function parseList (tokens: Tokenizer): { index: string, item: string } {
  const first = parseIdentifier(tokens);
  let second = '';

  tokens.removeSpaces();

  if(tokens.peek() === ',') {
    tokens.shift();
    tokens.removeSpaces();
    second = parseIdentifier(tokens);
  }

  return {
    index: second ? first : '',
    item: second ? second : first
  };
}

export default function parseEachExpression (expression: string): EachExpression {
  const tokens = new Tokenizer(expression);
  tokens.removeSpaces();

  const { index, item } = parseList(tokens);
  let collection = '';
  let key = '';

  tokens.removeSpaces();

  if(tokens.peekString('in')) {
    tokens.shiftNum(2);
    tokens.removeSpaces();

    collection = '';

    while(tokens.length() > 0 && tokens.peek() !== ' ') {
      collection += tokens.shift();
    }

    tokens.removeSpaces();

    if(tokens.peekString('with')) {
      tokens.shiftNum(4);
      tokens.removeSpaces();

      if(tokens.peekString('key')) {
        tokens.shiftNum(3);
        tokens.removeSpaces();
        key = parseParenthesizedExpression(tokens);
      } else {
        throw new Error(`Unexpected token: ${tokens.peek()}, expected \`key\` keyword`);
      }
    }
  } else {
    throw new Error(`Unexpected token: ${tokens.peek()}, expected \`in\` keyword`);
  }

  return {
    collection,
    item,
    index,
    key
  };
}
