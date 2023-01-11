import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
  $mapState = {'todos': true};
}

<div>
  <h1>Dashboard page</h1>
  <each(todo in this.todos with key(todo.id))>
    <TodoItem todoId={ todo.id }>
      { todo.text }
    </TodoItem>
  </each>
</div>
`);
console.log(result);
