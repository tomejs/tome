import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {

}

<div>
  <use stroke-width="2"></use>
</div>
`);
console.log(result);
