import { Parser } from 'acorn';
import acornClassFields from 'acorn-class-fields';

import Tokenizer from './tokenizer';
import parseJSBlock from './parse/parse_js_block';
import parseTemplate from './parse/parse_template';
import { NodeList } from './utils/types';

export default function parse (source: string) {
  const tokens = new Tokenizer(source);
  let classString: string = '';
  let classed: boolean = false;
  let template:NodeList = [];
  let imports: string[] = [];

  while(tokens.length() > 0) {
    tokens.removeSpaces();
    if(tokens.peekString('class')) {
      if(classed) {
        throw new Error('Only one class per file is allowed');
      }
      tokens.shiftNum(5);
      tokens.removeSpaces();

      if(tokens.peek() === '{') {
        classString += `export default class {\n${parseJSBlock(tokens)}\n}`;
        classed = true;
      } else {
        throw new Error('Unexpected token, expected "{"');
      }
    } else if(tokens.peekString('import')) {
      let importString = '';
      while(tokens.length() > 0 && tokens.peek() !== ';' && tokens.peek() !== '\n') {
        importString += tokens.shift();
      }

      tokens.shift();

      importString += ';\n';

      imports.push(importString);

      if(tokens.length() === 0) {
        throw new Error('Unexpected end of file');
      }
    } else if(tokens.peek() === '<') {
      template = parseTemplate(tokens);
    }
  }

  const lastNode = template[template.length - 1];

  if(lastNode && lastNode.type === 'text' && "value" in lastNode && lastNode.value.replace(/\s+/, '') === '') {
    template.pop();
  }

  const classAST = Parser.extend(acornClassFields).parse(classString, { ecmaVersion: 2020, sourceType: 'module' });

  return { classAST, template, imports };
}
