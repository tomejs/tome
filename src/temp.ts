import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
}

<div>
  <span class="it's">It's a good life</span>
  <each(index, item in this.items with key(index))>
  </each>
</div>
`);
console.log(result);
