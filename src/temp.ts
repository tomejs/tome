import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
import TodoItem from './TodoItem.tome';

class {
  #options = {};
  #components = {
    TodoItem,
  };
  todos = [
    { text: 'Make tome', done: true },
    { text: 'Make coffee', done: false },
    { text: 'Make tea', done: false },
  ];
  text = '';

  addTodo() {
    this.todos.push({ text: this.text, done: false });
    this.text = '';
    this.$refs.text.value = '';
  }
}

<!-- template -->

<div class="flex items-center flex-col gap-4">
  <h1 class="text-2xl font-bold">Todo Example</h1>
  <div class="flex gap-4">
    <input class="border border-gray-500 rounded px-2 py-1" type="text" ref="text" value={this.text} @input={this.text = $event.target.value} />
    <button class="rounded px-2 py-1 bg-blue-500 text-white w-24" @click={this.addTodo}>Add</button>
  </div>
  <ul class="flex flex-col justify-start w-96">
    <each(todo in this.todos with key(todo.text))>
      <TodoItem todo={todo} />
    </each>
  </ul>
</div>
`);
console.log(result);
