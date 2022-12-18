
export default class Tokenizer {
  source: string = '';
  tokens: string[] = [];

  constructor (source: string) {
    this.source = source;
    this.tokens = this.source.split('');
  }

  peek(): string {
    return this.tokens[0];
  }

  at(index: number): string {
    return this.tokens[index];
  }

  peekString(str: string): boolean {
    for(let i=0; i < str.length; i++) {
      if(this.tokens[i] !== str[i]) {
        return false;
      }
    }

    return true;
  }

  removeSpaces() {
    while(this.tokens[0] === ' ' || this.tokens[0] === '\n' || this.tokens[0] === '\t') {
      this.tokens.shift();
    }
  }

  shift(): string {
    return this.tokens.shift();
  }

  shiftNum(num: number): string[] {
    let result = [];
    for(let i=0; i < num; i++) {
      result.push(this.tokens.shift());
    }
    return result;
  }

  length(): number {
    return this.tokens.length;
  }
}
