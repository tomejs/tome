export interface Node {
  root: HTMLElement;
  mount(parent: HTMLElement, anchor: HTMLElement | Comment): void;
  unmount(): void;
  update(): void;
}

export type ConditionFunction = (() => boolean);

export type NodeCreationFunction = (() => Node[]);

export type ListFunction = (() => any[]);

export interface ListBlock {
  nodes: Node[];
  update(list: any[]): void;
};

export type ListBlockCreationFunction = ((item: any, index: number) => ListBlock);

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
