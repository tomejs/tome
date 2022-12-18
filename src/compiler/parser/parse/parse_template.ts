import Tokenizer from "../tokenizer";
import isAlpha from "../utils/is_alpha";
import parseHTMLNode from "./parse_html_node";
import parseHTMLComment from "./parse_html_comment";
import parseJSBlock from "./parse_js_block";
import { NodeList } from "../utils/types";

export default function parseTemplate(tokens: Tokenizer): NodeList {
  const nodes: NodeList = [];
  while(tokens.length() > 0) {
    if(tokens.peek() === '<' && isAlpha(tokens.at(1))) {
      nodes.push(parseHTMLNode(tokens));
    } else if(tokens.peekString('</')) {
        break;
    } else if(tokens.peekString('<!--')) {
      nodes.push(parseHTMLComment(tokens));
    } else if(tokens.peek() === '{') {
      nodes.push({
        type: 'interpolator',
        expression: parseJSBlock(tokens),
      });
    } else {
      let text = '';
      while(
        tokens.length() > 0
        && !((tokens.peek() === '<' && isAlpha(tokens.at(1))) || tokens.peekString('</') || tokens.peekString('<!--'))
        && tokens.peek() !== '{'
      ) {
        text += tokens.shift();
      }
      nodes.push({
        type: 'text',
        value: text,
      });
    }
  }

  return nodes;
}
