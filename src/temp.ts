import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {

}

<div>
  <circle stroke-width="2"></circle>
</div>
`);
console.log(result);
