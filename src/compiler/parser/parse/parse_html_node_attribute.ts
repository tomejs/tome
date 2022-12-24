import Tokenizer from "../tokenizer";
import parseJSBlock from "./parse_js_block";

export default function parseHTMLNodeAttribute(tokens: Tokenizer) {
  let name = '';
  let value: string | boolean = '';
  let type = '';
  while(
    tokens.length() > 0 && tokens.peek() !== '=' && tokens.peek() !== ' '
    && tokens.peek() !== '\n' && tokens.peek() !== '\t' && tokens.peek() !== '>' && tokens.peek() !== '/'
  ) {
    name += tokens.shift();
  }

  if(tokens.peek() === '=') {
    tokens.shift();
    if(tokens.peek() === '"') {
      type = 'string';
      tokens.shift();
      while(tokens.peek() !== '"') {
        value += tokens.shift();
      }
      tokens.shift();
    } else if(tokens.peek() === '{') {
      type = 'expression';
      value = parseJSBlock(tokens);
    }
  } else if(!tokens.length()) {
    throw new Error('Unterminated html start tag');
  } else {
    type = 'boolean';
    value = true;
  }

  return { name, value, type };
}
