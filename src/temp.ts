import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
  todos = [];
  text = '';

  addTodo() {
    this.todos.push({
      text: this.text,
      done: false
    });
    this.$refs.input.value = '';
  }
}

<div>
  <h1>Todo List</h1>
  <div>
    <input type="text" value={this.todo} ref="input" @input={this.text = $event.target.value} />
    <button @click={this.addTodo}>Add</button>
  </div>
  <ul>
    <each(item in this.todos as key(item.text))>
      <li style={todo.done ? 'text-decoration: line-through;' : ''}>{item.text}</li>
    </each>
  </ul>
</div>

`);
console.log(result);
