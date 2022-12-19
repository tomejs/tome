import Tokenizer from "../tokenizer";
import parseTemplate from "./parse_template";
import parseParenthesizedExpression from "./parse_parenthesized_expression";
import parseTagName from "./parse_tag_name";
import parseHTMLNodeAttribute from "./parse_html_node_attribute";
import { BlockNode, HTMLNodeAttribute } from "../utils/types";

export default function parseHTMLNode(tokens: Tokenizer): BlockNode {
  tokens.shift();
  const type = 'node';
  let tagName = parseTagName(tokens);
  let attributes: HTMLNodeAttribute[] = [];
  let children = [];
  let expression = '';
  tokens.removeSpaces();
  if(tagName === 'if' || tagName === 'else-if' || tagName === 'else') {
    expression = tagName === 'if' || tagName === 'else-if' ? parseParenthesizedExpression(tokens) : 'true';
  } else if(tagName === 'each') {
    expression = parseParenthesizedExpression(tokens);
  }

  while(tokens.length && tokens.peek() !== '>' && tokens.peek() !== '/') {
    const attribute: HTMLNodeAttribute = parseHTMLNodeAttribute(tokens);
    attributes.push(attribute);
    tokens.removeSpaces();
  }

  if(tokens.peek() === '>') {
    tokens.shift();
  } else {
    throw new Error('Unterminated html start tag');
  }

  children = parseTemplate(tokens);

  if(tokens.peekString(`</${tagName}>`)) {
    tokens.shiftNum(tagName.length + 3);
  } else {
    throw new Error('Unterminated html node');
  }
  return {
    type,
    tagName,
    expression,
    attributes,
    children
  };
}
