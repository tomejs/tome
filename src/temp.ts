import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
}

<!-- template -->

<div class="flex items-center flex-col gap-4">
  <div>
    <router-link to="/">Home</router-link>
    <router-link to="/about">About</router-link>
    <router-link to="/dashboard">Dashboard</router-link>
  </div>
  <div>
    <router-view />
  </div>
</div>
`);
console.log(result);
