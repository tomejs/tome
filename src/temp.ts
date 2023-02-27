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
  <each(cls in this.classes with key(cls.name))>
    <div>
      <each(index, student in cls.students with key(student.name))>
        {student.name}
      </each>
    </div>
  </each>
</div>
`);
console.log(result);
