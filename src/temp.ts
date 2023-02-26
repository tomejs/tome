import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
  str = 'abcdef';
}

<div>
  <each(char in this.str.split(''))>
  </each>
</div>
`);
console.log(result);
