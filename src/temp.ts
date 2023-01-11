import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
  count = 0;
  a = [];

  mounted() {
    setInterval(() => {
      this.count++;
      this.a.unshift(this.a.length + 1);
    }, 1000);
  }

  get msg() {
    return \`Count: \${this.count}\`;
  }

  msgMethod() {
    return \`Method: \${this.msg}\`;
  }
}


<div>
  <h1>Index page</h1>
  <div>{ this.msgMethod() }</div>
  <div>
    <each(index, num in this.a with key(index))>
      <div>{ num }</div>
    </each>
  </div>
</div>
`);
console.log(result);
