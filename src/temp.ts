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
      <each(student in cls.students)>
        {student.name}
      </each>
    </div>
  </each>
</div>
`);
console.log(result);
