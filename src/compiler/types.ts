import { Node } from 'acorn';

export interface PropertyDefinition extends Node {
  key: {
    name: string;
  };
  value: Node;
}

export interface MethodDefinition extends Node {
  key: {
    name: string;
  };
  kind: 'method' | 'get' | 'set';
  value: Node;
}

export interface Identifier extends Node {
  name: string;
}

export interface MemberExpression extends Node {
  object: Node;
  property: Identifier;
}

export interface DependencyList {
  [key: string]: string[];
}

export interface Initializers {
  [key: string]: Node;
}