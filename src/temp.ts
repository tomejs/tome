import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
}

<div>
  <span class="it's">It's a good life</span>
</div>
`);
console.log(result);
