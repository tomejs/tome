import Tokenizer from "../tokenizer";

export default function parseTagName(tokens: Tokenizer): string {
  let tagName = '';
  while(
    tokens.peek() !== ' '
    && tokens.peek() !== '\n'
    && tokens.peek() !== '>'
    && tokens.peek() !== '('
  ) {
    tagName += tokens.shift();
  }
  return tagName;
}
