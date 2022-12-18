import parse from "./compiler/parser";


console.log('Compiling ...');
const result = parse("<div class={{show: shouldShow}}></div>");
console.log(result);
