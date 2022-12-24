
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
  type: string;
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

export type AnyNode = BlockNode | HTMLTextNode | HTMLTextInterpolationNode;

export type NodeList = Array<AnyNode>;
