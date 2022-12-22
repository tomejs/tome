import { AnyNode, HTMLNode, NodeList } from '../parser/utils/types';
import renderText from './render_text';
import renderInterpolator from './render_interpolator';
import renderHTMLNode from './render_html_node';
import renderIfBlock from './render_if_block';

export default function renderNode(
  node: AnyNode, parentName: string, template: NodeList, index: number, isParentControlNode?: boolean
): string {
  let code = '';

  if(node.type === 'text') {
    code += renderText(node, parentName, isParentControlNode);
  } else if(node.type === 'interpolator') {
    code += renderInterpolator(node, parentName, isParentControlNode);
  } else if(node.type === 'node') {
    const { tagName } = node as HTMLNode;

    if (tagName === 'if') {
      code += renderIfBlock(node as HTMLNode, parentName, template, index, isParentControlNode);
    } else {
      code += renderHTMLNode(node, parentName, isParentControlNode);
    }
  }

  return code;
}
