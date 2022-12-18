import sucrase from '@rollup/plugin-sucrase';

export default [
  {
    input: 'src/compiler/index.ts',
    output: [
      {
        file: 'dist/compiler.js',
        format: 'cjs'
      },
      {
        file: 'dist/compiler.mjs',
        format: 'esm'
      }
    ],
    plugins: [sucrase({transforms: ['typescript']})]
  },
  {
    input: 'src/temp.ts',
    output: [
      {
        file: 'dist/temp.js',
        format: 'cjs'
      },
      {
        file: 'dist/temp.mjs',
        format: 'esm'
      }
    ],
    plugins: [sucrase({transforms: ['typescript']})]
  }
];
