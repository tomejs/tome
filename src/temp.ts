import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
  classes = [
    {
      name: 'something',
      students: [
        {
          name: 'John',
          age: 20
        }, {
          name: 'Jane',
          age: 21
        }
      ]
    }
  ];
}

<div>
  <button :tooltip={ { text: 'Hover on me' } }>Click me!</button>
</div>
`);
console.log(result);
