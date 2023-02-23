import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
  items = [];
}

<div>
  <if(this.items.length)>
    <each(item in this.items with key(item))>
      <div>{item}</div>
    </each>
  </if>
</div>
`);
console.log(result);
