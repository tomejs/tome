import Tokenizer from "../tokenizer";

export default function parseParenthesizedExpression(tokens: Tokenizer): string {
  let paren = 1;
  let contents = '';
  tokens.shift();
  while(tokens.length() > 0 && paren > 0) {
    contents += tokens.shift();
    if(tokens.peek() === '(') {
      paren++;
    } else if (tokens.peek() === '\'' || tokens.peek() === '"' || tokens.peek() === '`') {
      let quote = tokens.shift();
      contents += quote;
      while(tokens.length() > 0 && tokens.peek() !== quote) {
        contents += tokens.shift();
      }
      contents += tokens.shift();
      continue;
    } else if(tokens.peek() === ')') {
      paren--;
    }
  }

  if(tokens.length() === 0) {
    throw new Error('Unterminated parenthesized expression');
  }

  tokens.shift();

  return contents.trim();
}
