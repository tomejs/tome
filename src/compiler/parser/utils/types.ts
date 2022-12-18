
export interface Node {
  type: string;
}

export interface HTMLTextNode extends Node {
  value: string;
}

export interface HTMLTextInterpolationNode extends Node {
  expression: string;
}

export interface HTMLNodeAttribute {
  name: string;
  value: string | boolean;
}

export interface HTMLNode {
  type: string;
  tagName: string;
  attributes: Array<HTMLNodeAttribute>;
  children: NodeList;
};

export interface ControlNode {
  type: string;
  tagName: string;
  expression: string;
  children: NodeList;
}

export type BlockNode = HTMLNode | ControlNode;

export type NodeList = Array<BlockNode | HTMLTextNode | HTMLTextInterpolationNode>;
