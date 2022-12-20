const nodeCount:{ [key: string]: number } = {};

export default function nodeName(name: string) {
  if(!nodeCount[name]) {
    nodeCount[name] = 0;
  }

  nodeCount[name] += 1;
  return `${name}${nodeCount[name]}`;
}
