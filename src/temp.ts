import { compile } from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
}

<div>
  <each( project in this.projects with key(project._id) )>
    <div class="p-6 bg-white m-6 w-64 rounded-md shadow-sm">
      <div class="font-bold text-lg">{ project.name }</div>
      <if( project.description )>
        <div class="text-gray-500">{ project.description }</div>
      </if>
      <!--
      <else>
        <div class="text-gray-500">No description</div>
      </else>
      -->
    </div>
  </each>
</div>
`);
console.log(result);
