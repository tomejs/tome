import parse from "../../src/compiler/parser";
import assert from "assert";
import fs from 'fs';

describe("Parser", () => {
  fs.readdirSync(`${__dirname}/samples`).forEach(dir => {
    it(dir, () => {
      fs.readdirSync(`${__dirname}/samples/${dir}`).forEach(files => {
        if(files.includes('output.json')) {
          const contents = fs.readFileSync(`${__dirname}/samples/${dir}/input.tome`, 'utf-8');
          const output = fs.readFileSync(`${__dirname}/samples/${dir}/output.json`, 'utf-8');
          const outputObject = JSON.parse(output);
          const { template } = parse(contents);
          assert.deepEqual(template, outputObject);
        }
      });
    });
  });
});
