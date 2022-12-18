import parse from './parser';

export default function compile (source: string) {
  const { classString, template } = parse(source);

  console.log(classString, template);
}
