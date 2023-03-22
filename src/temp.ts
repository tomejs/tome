import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
  test = null;
}

<div>
  <div>{ this.test }</div>
</div>
`);
console.log(result);
