import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
  class {
    #components = {
      Tab1,
      Tab2,
      Tab3,
    };
    component = 'Tab1';
  }

  <div>
    <component name={ this.component } />
  </div>
`);
console.log(result);
