import { AnyNode, HTMLNode } from "../parser/utils/types";
import nodeName from "./node_name";
import renderNode from "./render_node";

export default function renderHTMLNode(
  node: AnyNode,
  parentName: string,
  isParentControlNode?: boolean,
  isParentEachNode?: boolean
) {
  let code = '';
  const { tagName, attributes, children } = node as HTMLNode;
  const name = nodeName(tagName);

  code += `const ${name} = node('${tagName}', ${JSON.stringify(attributes)});\n`;
  children.forEach((child, index) => {
    code += renderNode(child, name, children, index, isParentControlNode, isParentEachNode);
  });

  if(isParentControlNode) {
    code += `children.push(${name});\n`;
  } else {
    code += `${name}.mount(${parentName});\n`;
  }

  return code;
}
