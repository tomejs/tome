import Tokenizer from "../tokenizer";

export default function parseJSBlock(tokens: Tokenizer): string {
  let braces = 1;
  let contents = '';
  tokens.shift();
  while(tokens.length() > 0) {
    if(tokens.peek() === '{') {
      braces++;
    } else if (tokens.peek() === '\'' || tokens.peek() === '"' || tokens.peek() === '`') {
      let quote = tokens.shift();
      contents += quote;
      while(tokens.peek() !== quote) {
        contents += tokens.shift();
        if(tokens.peekString(`${quote}`)) {
          contents += tokens.shiftNum(2);
        }
      }
      contents += tokens.shift();
      continue;
    } else if(tokens.peek() === '}') {
      braces--;

      if(braces === 0) {
        break;
      }
    }

    contents += tokens.shift();
  }

  if(tokens.length() === 0) {
    throw new Error('Unterminated block');
  }

  tokens.shift();

  return contents.trim();
}
