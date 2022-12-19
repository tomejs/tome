import parse from './parser';

export default function compile (source: string) {
  const { classAST, template } = parse(source);

  console.log(classAST, template);
}
