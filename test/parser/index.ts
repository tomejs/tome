import parse from "../../src/compiler/parser";
import assert from "assert";
import fs from 'fs';

describe("Parser test", () => {
  fs.readdirSync(`${__dirname}/samples`).forEach(dir => {
    it(dir, () => {
      fs.readdirSync(`${__dirname}/samples/${dir}`).forEach(files => {
        if(files.includes('output.json')) {
          const contents = fs.readFileSync(`${__dirname}/samples/${dir}/input.classic`, 'utf-8');
          const output = fs.readFileSync(`${__dirname}/samples/${dir}/output.json`, 'utf-8');
          const outputObject = JSON.parse(output);
          const result = parse(contents);
          assert.deepEqual(result, outputObject);
        }
      });
    });
  });
});
