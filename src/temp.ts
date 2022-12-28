import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {

}

<div>
  <ChildComponent>
    <div>Something to be added to the slot</div>
  </ChildComponent>
  <slot>
    There is a slot here...
  </slot>
</div>

`);
console.log(result);
