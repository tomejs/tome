import Tokenizer from "../tokenizer";
import parseTemplate from "./parse_template";
import parseParenthesizedExpression from "./parse_parenthesized_expression";
import parseTagName from "./parse_tag_name";
import parseHTMLNodeAttribute from "./parse_html_node_attribute";
import { BlockNode, HTMLNodeAttribute, NodeList } from "../utils/types";

export default function parseHTMLNode(tokens: Tokenizer): BlockNode {
  tokens.shift();
  const type = 'node';
  let tagName = parseTagName(tokens);
  let attributes: HTMLNodeAttribute[] = [];
  let children: NodeList = [];
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
    children = parseTemplate(tokens);

    if(tokens.peekString(`</${tagName}>`)) {
      tokens.shiftNum(tagName.length + 3);
    } else {
      throw new Error('Unterminated html node');
    }
  } else if(tokens.peekString('/>')) {
    tokens.shiftNum(2);
  } else {
    throw new Error('Unterminated html start tag');
  }

  return {
    type,
    tagName,
    expression,
    attributes,
    children
  };
}
