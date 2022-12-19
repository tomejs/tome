import parse from "./compiler/parser";


console.log('Compiling ...');
const result = parse(`<if(this.isLoading)>
<div>Loading ...</div>
</if>`);
console.log(result);
