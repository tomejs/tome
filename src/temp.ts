import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
import RouterView from './components/RouterView.tome'
import RouterLink from './components/RouterLink.tome'

class {
  #components = {
    RouterView
  }
}

<!-- template -->

<div class="flex items-center flex-col gap-4">
  <div>
    <RouterLink to="/">Home</RouterLink>
    <RouterLink to="/about">About</RouterLink>
    <RouterLink to="/dashboard">Dashboard</RouterLink>
  </div>
  <div>
    <RouterView />
  </div>
</div>
`);
console.log(result);
