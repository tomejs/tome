import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
}

<div>
  <div class={['hello', {test: this.test}]}></div>
</div>
`);
console.log(result);
