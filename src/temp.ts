import compile from "./compiler";


console.log('Compiling ...');
const result = compile(`
class {
  count = 0;
  objCount = { deep: { nested: { value: 0 } } };
  list = ['a', 'b', 'c'];

  get msg() {
    return \`count: \$\{this.count\}\`;
  }

  elaborateMsg() {
    return \`elaborate \$\{this.msg\}\`;
  }

  created() {
    setInterval(() => {
      this.count++;
      this.objCount.value++;
    }, 1000);

    setTimeout(_ => {
      this.list[0] = 'Apple';
    }, 3000);
  }
}

<div class="something" data-count={ this.count }>
  { this.msg }
  { this.elaborateMsg() }
  { this.objectCount.deep.nested.value }
  { this.list[0] }
  <!--
  <if (this.count < 10)>
    <if (this.count < 5)>
      Count is < 5
    </if>
    <else>
      Count is >= 5
    </else>
  </if>
  <else>
    Count is >= 10
  </else>
  <each (item, index in list)>
  </each>
  -->
</div>
`);
console.log(result);
