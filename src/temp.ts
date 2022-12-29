import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
  $mapStore = ['todos'];
  $mapState = {
    'todos': ['todoList']
  };
  $mapGetters = {
    'todos': ['todoInit']
  };
  $mapMethods = {
    'todos': ['addTodo']
  };
  name = 'World';

  get greeting() {
    return this.getMsg();
  }

  getMsg() {
    return 'Hello ' + this.name;
  }
}

<div>
  <div>{ this.addTodo() }</div>
</div>

`);
console.log(result);
