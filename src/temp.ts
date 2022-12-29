import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
  todos = [
    { id: 1, text: 'Make tome', done: true },
    { id: 2, text: 'Make coffee', done: false },
    { id: 3, text: 'Make tea', done: false },
  ];

  addTodo() {
    this.todos.push({ id: this.todos.length + 1, text: this.text, done: false });
    this.text = '';
  }

  getTodoById(id) {
    return this.todos.find((todo) => todo.id === id);
  }

  toggleTodo(id) {
    const todo = this.getTodoById(id);
    todo.done = !todo.done;
  }
}
`);
console.log(result);
