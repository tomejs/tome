import Tokenizer from "../tokenizer";

export default function parseHTMLComment(tokens: Tokenizer) {
  tokens.shiftNum(4);
  let result = {
    type: 'comment',
    value: '',
  };
  while(tokens.length() > 0 && !tokens.peekString('-->')) {
    result.value += tokens.shift();
  }
  if(tokens.peekString('-->')) {
    tokens.shiftNum(3);
    return result;
  } else {
    throw new Error('Unterminated html comment');
  }
}
