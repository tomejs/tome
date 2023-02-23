export interface Node {
  root: HTMLElement | Comment;
  mount(parent: any, anchor?: any): void;
  unmount(): void;
  update?(): void;
  append?(child: HTMLElement): void;
  insertBefore?(child: HTMLElement, anchor: HTMLElement): void;
  setAttribute?(name: string, value: string): void;
  addEventListener?(name: string, handler: () => void): void;
}

export type ConditionFunction = (() => boolean);

export interface IfBlockNode {
  children: Node[];
  subs: any[];
}

export type NodeCreationFunction = (() => IfBlockNode);

export type ListFunction = (() => any[]);

export interface ListBlock {
  nodes: Node[];
  update(list: any[]): void;
};

export interface IfBlockItems {
  children: Node[];
  subs: any[];
};

export type ListBlockCreationFunction = ((item: () => any, index: () => number) => ListBlock);

export type KeyFunction = ((item: any, index: number) => any);

export type ListBlockUpdateFunction = ((item: any, index: number) => void);

export interface ListKeyedBlock {
  nodes: Node[];
  update: ListBlockUpdateFunction;
  index: number;
};

export type ListKeyedBlockMap = { [key: string]: ListKeyedBlock };

export interface Slot extends Node {
  setCreationFn(fn: NodeCreationFunction): void;
}
