import { AnyNode, HTMLNode, NodeList } from '../parser/utils/types';
import renderText from './render_text';
import renderInterpolator from './render_interpolator';
import renderHTMLNode from './render_html_node';
import renderIfBlock from './render_if_block';
import renderEach from './render_each';
import isHTMLNode from '../utils/is_html_node';
import renderComponent from './render_component';
import renderSlot from './render_slot';
import renderDynamicComponent from './render_dynamic_component';

export default function renderNode(
  node: AnyNode, parentName: string, template: NodeList, index: number, isParentControlNode?: boolean,
  isParentEachNode?: boolean
): string {
  let code = '';

  if(node.type === 'text') {
    code += renderText(node, parentName, isParentControlNode);
  } else if(node.type === 'interpolator') {
    code += renderInterpolator(node, parentName, isParentControlNode, isParentEachNode);
  } else if(node.type === 'node') {
    const { tagName } = node as HTMLNode;

    if (tagName === 'if') {
      code += renderIfBlock(node as HTMLNode, parentName, template, index, isParentControlNode, isParentEachNode);
    } else if (tagName === 'each') {
      code += renderEach(node as HTMLNode, parentName, index, isParentControlNode, isParentEachNode);
    } else if (tagName === 'slot') {
      if(isParentEachNode) {
        throw new Error('Cannot use <slot> inside <each>');
      }
      code += renderSlot(node as HTMLNode, parentName, isParentControlNode);
    } else if (tagName === 'component') {
      code += renderDynamicComponent(node as HTMLNode, parentName, isParentControlNode, isParentEachNode);
    } else if(!isHTMLNode(tagName)) {
      code += renderComponent(node as HTMLNode, parentName, isParentControlNode, isParentEachNode);
    } else {
      code += renderHTMLNode(node as HTMLNode, parentName, isParentControlNode, isParentEachNode);
    }
  }

  return code;
}
